const config = require("../config");
const regExpValidate = require("../routine/regExpValidate");
const NameTable = require("./nameTable");
const Segment = require("./segment");

class DataSegment extends Segment {
    constructor (content) {
        super(content);
        
        this._nameTable = new NameTable(2**config.hardware.machineWord);
        this._memoryUsed = 0;
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

    _declareVariable (type, name, size, values) {
        if (!Object.keys(config.types).includes(type)) throw new TypeError(`Unknown type ${type}`);
        if (!regExpValidate(name, config.syntax.nameValidator)) throw new Error(`Invalid name: ${name}`);
        if (values.length === 0) throw new Error(`Initial value for ${name} is not specified.`);

        if (this._nameTable.has(name)) throw new ReferenceError(`Identifier ${name} has already been declared.`);

        try {
            this._nameTable.add(name, this.memoryUsed);
        } catch (e) {
            throw new Error("Not enough memory for data.");
        }

        this._memoryUsed += size;
        
        if (values[0] === config.syntax.unitializedDataSymbol) {
            for (let i = 0; i < size; i++) this.dataInternalRepresentation.push(config.types[type].defaultValue);
            return;
        }

        if (values.length !== size) throw new Error("Count of provided values doesn't match specified.");

        let typeValidator = new RegExp(config.types[type].validator.replaceAll("$word", String(config.hardware.machineWord))); 

        for (let i of values) {
            if (!regExpValidate(i, typeValidator)) throw new TypeError(`Provided value ${i} doesn't belong to type ${type}.`);
            let value = config.types[type].parse(i);
            this.dataInternalRepresentation.push(value);
        }
    }

    parseData () {
        this._memoryUsed = 0;
        this._dataInternalRepresentation = [];

        for (let i of this.content) {
            let [type, name, ...values] = i.split(" ");

            let size = 1;
            if (name.includes("[")) {
                let sizeStr;
                [name, sizeStr] = name.replaceAll("]", "").split("[");
                size = Number(sizeStr);
            }
            
            this._declareVariable(type, name, size, values);
        }

        if (this._memoryUsed === config.hardware.dataCapacity) throw new Error("Not enough memory for data.");

        return this._dataInternalRepresentation.slice(0);
    } 
}

module.exports = DataSegment;