const DTrigger = require("./dTrigger");
const Part = require("./part");
const Port = require("./port");

class DTriggerPort extends Part {
    constructor (scheme, size) {
        super(scheme);
        
        this._size = size;

        let inputs = [];
        let outputs = [];
        let clks = [];

        for (let i = 0; i < size; i++) {
            let dTrigger = new DTrigger(scheme);

            inputs.push(dTrigger.input);
            outputs.push(dTrigger.output);
            clks.push(dTrigger.clk);
        }

        this._input = new Port(scheme, size, inputs);
        this._output = new Port(scheme, size, outputs);
        this._clk = new Port(scheme, size, clks);
    }

    get size () {
        return this._size;
    }

    get input () {
        return this._input;
    }

    get output () {
        return this._output;
    }

    get clk () {
        return this._clk;
    }
}

module.exports = DTriggerPort;