const Part = require("./part");

class PrimarySum extends Part {
    constructor (scheme) {
        super(scheme);

        let inputA = this.add("or");
        let inputB = this.add("or");
        let inputCarryOver = this.add("or");

        let xorInput = this.add("xor");
        let output = this.add("xor");

        inputA.connect(xorInput);
        inputB.connect(xorInput);

        inputCarryOver.connect(output);
        xorInput.connect(output);

        let andInput = this.add("and");
        let andCarry = this.add("and");
        let carryOver = this.add("or");

        inputA.connect(andInput);
        inputB.connect(andInput);
        andInput.connect(carryOver);

        xorInput.connect(andCarry);
        inputCarryOver.connect(andCarry);
        andCarry.connect(carryOver);

        this._inputA = inputA;
        this._inputB = inputB;
        this._inputCarryOver = inputCarryOver;
        this._output = output;
        this._carryOver = carryOver;
    }

    get inputA () {
        return this._inputA;
    }

    get inputB () {
        return this._inputB;
    }

    get inputCarryOver () {
        return this._inputCarryOver;
    }

    get output () {
        return this._output;
    }

    get carryOver () {
        return this._carryOver;
    }
}

module.exports = PrimarySum;