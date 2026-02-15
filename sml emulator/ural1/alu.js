const { Part, Port, MUXPort, Sum } = require("../sml/sml");
const { characteristic, aluModeCodes } = require("./config");

class ALU extends Part {
    constructor (scheme) {
        super(scheme);

        this._inputA = new Port(scheme, characteristic.machineWord);
        this._inputB = new Port(scheme, characteristic.machineWord);

        // отрицание входа A
        let notA = new Port(scheme, characteristic.machineWord, "nor");
        this.inputA.connect(notA);

        // конъюнкция A и B
        let inputsAnd = new Port(scheme, characteristic.machineWord, "and");
        this.inputA.connect(inputsAnd);
        this.inputB.connect(inputsAnd);

        // дизъюнкция A и B
        let inputsOr = new Port(scheme, characteristic.machineWord, "or");
        this.inputA.connect(inputsOr);
        this.inputB.connect(inputsOr);

        // строгая дизъюнкция A и B
        let inputsXor = new Port(scheme, characteristic.machineWord, "xor");
        this.inputA.connect(inputsXor);
        this.inputB.connect(inputsXor);

        // сумма A и B
        let inputsSum = new Sum(scheme, characteristic.machineWord);
        this.inputA.connect(inputsSum.inputA);
        this.inputB.connect(inputsSum.inputB);

        this._overflowOutput = this.add("and");

        notA.elem(characteristic.machineWord - 1).connect(this.overflowOutput);
        inputsSum.output.elem(characteristic.machineWord - 1).connect(this.overflowOutput);

        // разность A и B
        let notB = new Port(scheme, characteristic.machineWord, "nor");
        let inputsDifference = new Sum(scheme, characteristic.machineWord);
        let add1 = this.add("switch", true);

        add1.connect(inputsDifference.inputCarryOver);
        this.inputA.connect(inputsDifference.inputA);
        this.inputB.connect(notB);
        notB.connect(inputsDifference.inputB);

        this._lessOutput = inputsDifference.output.elem(characteristic.machineWord - 1);

        // сдвиги A
        let shiftRightLogic = this._makeShiftRight(this.inputA);
        let shiftRightArithm = this._makeShiftRight(this.inputA, true);

        // проверка на равенство
        this._equalOutput = this.add("and");
        let compareInputs = new Port(scheme, characteristic.machineWord, "xnor");

        this.inputA.connect(compareInputs);
        this.inputB.connect(compareInputs);
        compareInputs.connect(this.equalOutput);

        // выбор операции
        this._modeMUX = new MUXPort(scheme, 8, characteristic.machineWord);

        this._modeMUX.input(aluModeCodes.ADD).addSource(inputsSum.output);
        this._modeMUX.input(aluModeCodes.SUB).addSource(inputsDifference.output);
        this._modeMUX.input(aluModeCodes.AND).addSource(inputsAnd);
        this._modeMUX.input(aluModeCodes.OR).addSource(inputsOr);
        this._modeMUX.input(aluModeCodes.XOR).addSource(inputsXor);
        this._modeMUX.input(aluModeCodes.NOT).addSource(notA);
        this._modeMUX.input(aluModeCodes.SRL).addSource(shiftRightLogic);
        this._modeMUX.input(aluModeCodes.SRA).addSource(shiftRightArithm);
    }

    _makeShiftRight (source, isArithm = false) {
        let shiftRight = new Port(this.scheme, characteristic.machineWord, "or");

        for (let i = 1; i < characteristic.machineWord; i++) {
            source.elem(i).connect(shiftRight.elem(i - 1));
        }

        if (isArithm) {
            source.elem(characteristic.machineWord - 1).connect(shiftRight.elem(characteristic.machineWord - 1));
        }

        return shiftRight;
    }

    get selectSize () {
        return this._modeMUX.selectSize;
    }

    get modesCount () {
        return this._modeMUX.inputsCount;
    }

    get inputA () {
        return this._inputA;
    }

    get inputB () {
        return this._inputB;
    }

    get modeSelect () {
        return this._modeMUX.inputSelect;
    }

    get output () {
        return this._modeMUX.output;
    }

    get equalOutput () {
        return this._equalOutput;
    }

    get lessOutput () {
        return this._lessOutput;
    }

    get overflowOutput () {
        return this._overflowOutput;
    }
}

module.exports = ALU;