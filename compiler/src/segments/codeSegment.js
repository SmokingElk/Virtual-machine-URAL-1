const config = require("../config");
const { toBin } = require("../routine/binaryOperations");
const regExpValidate = require("../routine/regExpValidate");
const compileInstruction = require("./compileInstruction");
const NameTable = require("./nameTable");
const Segment = require("./segment");

const procedureKeepingInstructions = config.procedureKeepingInstructions.map(e => config.syntax.instructionsNames[e]);

class CodeSegment extends Segment {
    constructor (content) {
        super(content);
        
        this._checkContentCorrect();

        this._nameTable = new NameTable(2**config.hardware.machineWord);
        this._memoryUsed = 0;
        this._procedureNamesList = [];
        this._instructions = [];
        this._dataInternalRepresentation = [];
    }

    get memoryUsed () {
        return this._memoryUsed;
    }

    get dataInternalRepresentation () {
        return this._dataInternalRepresentation;
    }

    get nameTable () {
        return this._nameTable;
    }

    _checkContentCorrect () {
        if (this._content.length === 0) throw new Error("Programm doesn't have entry point.");
        if (!this._content[0].startsWith(config.syntax.procedureKeyword)) throw new Error("Code in global section is prohibited.");
    }

    _addServiceParts (staticMemoryUsed) {
        let isrPremission = this.content.join("").indexOf(config.syntax.isrName + config.syntax.labelNameSep) !== -1;
        let serviceVariables = {
            staticUsed: toBin(staticMemoryUsed, config.hardware.machineWord),
            dataSegAddr: toBin(config.hardware.segmentsNums.data, config.hardware.machineWord),
            isrName: config.syntax.isrName,
            entryName: config.syntax.entryPointName,
            intPermission: isrPremission ? config.syntax.instructionsNames.int : config.syntax.instructionsNames.noI,
        };

        let servicePart = config.servicePartText;
        
        if (!isrPremission) {
            servicePart += "\n" + config.defaultIsr;
        }

        for (let [key, val] of Object.entries(serviceVariables)) {
            servicePart = servicePart.replaceAll("$" + key, val);
        }

        this._content = servicePart.split("\n").concat(this._content);
    }

    _getRefFuncArg (line) {
        let template = new RegExp(config.syntax.refFuncName + "(.+)");
        let match = line.match(template);
        if (match === null) return "";
        return match[0].split("(")[1].split(")")[0];
    }

    _getUsedNames () {
        let usageTable = {};
        let localAddrs = {};

        for (let i = 0; i < this.content.length; i++) {
            let line = this.content[i];
            if (!line.startsWith(config.syntax.procedureKeyword)) continue;

            let [_, name] = line.replaceAll(config.syntax.labelNameSep, "").split(config.syntax.argSep);
            if (!regExpValidate(name, config.syntax.nameValidator)) throw new Error(`Invalid name: ${name}`);
            localAddrs[name] = i;
            usageTable[name] = false;
        }

        if (!usageTable.hasOwnProperty(config.syntax.entryPointName)) throw new Error("Programm doesn't have entry point.");

        usageTable[config.syntax.isrName] = true;
        usageTable[config.syntax.entryPointName] = true;
        
        let traversingQueue = [config.syntax.entryPointName];
        let traversingAddr = localAddrs[config.syntax.entryPointName] + 1;

        while (traversingQueue.length > 0) {
            if (traversingAddr >= this.content.length || this.content[traversingAddr].startsWith(config.syntax.procedureKeyword)) {
                traversingQueue.shift();
                traversingAddr = (localAddrs[traversingQueue[0]] ?? 0) + 1;
                continue;
            }

            let line = this.content[traversingAddr].split(config.syntax.labelNameSep).slice(-1)[0].trim();

            let [name, ...args] = line.split(config.syntax.argSep);

            if (procedureKeepingInstructions.includes(name) && usageTable.hasOwnProperty(args[0]) && !usageTable[args[0]]) {
                usageTable[args[0]] = true;
                traversingQueue.push(args[0]);
            } else if (line.indexOf(config.syntax.refFuncName) !== -1) {
                let label = this._getRefFuncArg(line);

                if (label !== "" && usageTable.hasOwnProperty(label) && !usageTable[label]) {
                    usageTable[label] = true;
                    traversingQueue.push(label);
                }
            }

            traversingAddr++;
        }

        return usageTable;
    }

    _declareLabel (name, addr) {
        if (this._nameTable.has(name)) throw new ReferenceError(`Identifier ${name} has already been declared.`);

        try {
            this._nameTable.add(name, addr) 
        } catch (error) {
            throw new Error("Not enough memory for instructions");
        }
    }

    _extractInstructions () {
        this._memoryUsed = 0;
        let includePart = true;
        let isISRBody = false;
        let usageTable = this._getUsedNames();

        this._instructions = [];

        for (let i of this.content) {
            if (i.startsWith(config.syntax.procedureKeyword)) {
                let [_, name] = i.replaceAll(config.syntax.labelNameSep, "").split(config.syntax.argSep);
                includePart = usageTable[name];
                if (usageTable[name]) this._declareLabel(name, this._memoryUsed);
                isISRBody = name === config.syntax.isrName;
                continue;
            }

            if (!includePart) continue;

            if (i.indexOf(config.syntax.labelNameSep) !== -1) {
                let [labelName, _] = i.split(config.syntax.labelNameSep);
                this._declareLabel(labelName, this._memoryUsed);
            }

            let instruction = i.split(config.syntax.labelNameSep).slice(-1)[0].trim();

            if (isISRBody && instruction.startsWith(config.syntax.instructionsNames.ret)) {
                instruction = config.syntax.instructionsNames.retI;
            }

            this._instructions.push(instruction);
            this._memoryUsed++;

            if (this._memoryUsed > config.hardware.instructionsCapacity) throw new Error("Not enough memory for instructions.");
        }
    }

    _processRefFunc (dataNameTable) {
        let commonNameTable = this._nameTable.merge(dataNameTable);

        for (let i = 0; i < this._instructions.length; i++) {
            let line = this._instructions[i];
            if (line.indexOf(config.syntax.refFuncName + "(") === -1) continue;

            let name = this._getRefFuncArg(line);
            if (!commonNameTable.has(name)) throw new ReferenceError(`Name ${name} is not defined.`);
            let addr = commonNameTable.getAddr(name);

            let lineProcessed = line.replace(`${config.syntax.refFuncName}(${name})`, toBin(addr, config.hardware.machineWord));
            this._instructions[i] = lineProcessed;
        }
    }

    _processIPFunc () {
        for (let i = 0; i < this._instructions.length; i++) {
            let line = this._instructions[i];
            if (line.indexOf(config.syntax.ipFuncName + "(") === -1) continue;

            let ipVal = toBin(i, config.hardware.machineWord);
            let lineProcessed = line.replace(`${config.syntax.ipFuncName}()`, ipVal);
            this._instructions[i] = lineProcessed;
        }
    }

    compileInstructions (staticMemoryUsed, dataNameTable) {
        this._addServiceParts(staticMemoryUsed);
        this._extractInstructions();
        this._processRefFunc(dataNameTable);
        this._processIPFunc();

        this._dataInternalRepresentation = [];

        for (let i = 0; i < this._instructions.length; i++) {
            let instruction = this._instructions[i];
            let instructionCompiled = compileInstruction(instruction, dataNameTable, this._nameTable, `${i + 1} ${instruction}`);
            this._dataInternalRepresentation = this._dataInternalRepresentation.concat(instructionCompiled);
        }

        return this._dataInternalRepresentation.slice(0);
    }
}

module.exports = CodeSegment;