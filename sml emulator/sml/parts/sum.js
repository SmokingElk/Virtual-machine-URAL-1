const Part = require("./part");
const Port = require("./port");
const PrimarySum = require("./primarySum");

class Sum extends Part {
    constructor (scheme, size) {
        super(scheme);

        this._size = size;

        let inputsA = [];
        let inputsB = [];
        let outputs = [];

        let carryOver = null;

        for (let i = 0; i < size; i++) {
            let primarySum = new PrimarySum(scheme);

            inputsA.push(primarySum.inputA);
            inputsB.push(primarySum.inputB);
            outputs.push(primarySum.output);

            if (carryOver == null) this._inputCarryOver = primarySum.inputCarryOver;
            else carryOver.connect(primarySum.inputCarryOver);
            carryOver = primarySum.carryOver; 
        }

        this._inputA = new Port(scheme, size, inputsA);
        this._inputB = new Port(scheme, size, inputsB);
        this._output = new Port(scheme, size, outputs);
        this._carryOver = carryOver;
    }

    get size () {
        return this._size;
    }

    get inputA () {
        return this._inputA;
    }

    get inputB () {
        return this._inputB;
    }

    get output () {
        return this._output;
    }

    get inputCarryOver () {
        return this._inputCarryOver;
    }

    get carryOver () {
        return this._carryOver;
    }
}

module.exports = Sum;