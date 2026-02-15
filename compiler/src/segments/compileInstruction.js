const config = require("../config");
const { toBin } = require("../routine/binaryOperations");
const regExpValidate = require("../routine/regExpValidate");

const makeBytes = function (opCode, params) {
    let byte0 = opCode + (params.funct ?? "000") + "0";
    let byte1 = params.const2 ?? ((params.reg1 ?? "0000") + (params.reg2 ?? "0000"));
    let byte2 = params.const1 ?? "00000000";
    return [byte0, byte1, byte2].map(e => Number.parseInt(e, 2));
};

const checkArgsCorrect = function (name, line, args, num) {
	if (args.length !== num) throw new Error(`Invalid arguments num ${args.length} for command ${name}. Line ${line}`);
};

const checkRegCorrect = function (line, regName) {
	if (!config.hardware.register.hasOwnProperty(regName)) throw new Error(`Unknown register name ${regName}. Line ${line}`);
};

const checkConstCorrect = function (line, cnt) {
	if (cnt.length === config.hardware.machineWord) return;
    throw new Error(`Invalid constant len ${cnt.length}. Expected ${config.regSize}. Line ${line}`);  
};

const checkLabel = function (name, nameTable, line) {
    if (!nameTable.has(name)) throw new ReferenceError(`Label ${name} is not declarated. Line ${line}`);
};

const checkVariable = function (name, nameTable, line) {
    if (!nameTable.has(name)) throw new ReferenceError(`Variable ${name} is not declarated. Line ${line}`);
};

const getReg = function (requirement, args, line) {
    let regName = typeof requirement === "string" ? requirement : args[requirement];
    checkRegCorrect(line, regName);
    return config.hardware.register[regName];
};

const getConst = function (requirement, args, line) {
    let constVal = typeof requirement === "string" ? requirement : args[requirement];

    for (let [_, i] of Object.entries(config.types)) {
        let validator = new RegExp(i.validator.replaceAll("$word", String(config.hardware.machineWord)));
        if (!regExpValidate(constVal, validator)) continue;

        let value = i.parse(constVal);
        return toBin(value, config.hardware.machineWord);
    }

    throw new Error(`Constant ${constVal} doesn't match any type. Line ${line}`);
};

const getLabel = function (requirement, args, nameTable, line) {
    let labelName = args[requirement];
    checkLabel(labelName, nameTable, line);
    let addr = nameTable.getAddr(labelName);
    return toBin(addr, config.hardware.machineWord);
};

const getDataAddr = function (requirement, args, nameTable, line) {
    let variableName = args[requirement];
    checkVariable(variableName, nameTable, line);
    let addr = nameTable.getAddr(variableName);
    return toBin(addr, config.hardware.machineWord);
};

const compileInstruction = function (instruction, dataNameTable, labelNameTable, line) {
    let [name, ...args] = instruction.split(config.syntax.argSep);

    if (!config.commands.hasOwnProperty(name)) throw new Error(`Unknown command ${name}.`);

    let commandData = config.commands[name];
	let opCodeName = commandData.opCode ?? name;
    let instructionParams = {};

    checkArgsCorrect(name, line, args, commandData.argsCount ?? 0);

    if (commandData.hasOwnProperty("reg1")) instructionParams.reg1 = getReg(commandData.reg1, args, line);
    if (commandData.hasOwnProperty("reg2")) instructionParams.reg2 = getReg(commandData.reg2, args, line);

    if (commandData.hasOwnProperty("const1")) instructionParams.const1 = getConst(commandData.const1, args, line);
    if (commandData.hasOwnProperty("const2")) instructionParams.const2 = getConst(commandData.const2, args, line);

    if (commandData.hasOwnProperty("funct")) instructionParams.funct = commandData.funct;
    if (commandData.hasOwnProperty("ALU")) instructionParams.funct = config.hardware.ALU[commandData.ALU];
    if (commandData.hasOwnProperty("cmpMode")) instructionParams.funct = config.hardware.CMP[commandData.cmpMode];

    if (commandData.hasOwnProperty("label")) instructionParams.const1 = getLabel(commandData.label, args, labelNameTable, line);
    if (commandData.hasOwnProperty("dataAddr")) {
        instructionParams.const1 = getDataAddr(commandData.dataAddr, args, dataNameTable, line);
    }

    return makeBytes(config.hardware.opCodes[opCodeName], instructionParams);
};

module.exports = compileInstruction;