const Decoder = require("./decoder");
const Part = require("./part");
const Port = require("./port");

class MUX extends Part {
    constructor (scheme, inputsCount) {
        super(scheme);

        let decoder = new Decoder(scheme, inputsCount);
        let input = new Port(scheme, inputsCount, "and");
        let output = this.add("or");

        decoder.channels.connect(input);
        input.connect(output);

        this._decoder = decoder;
        this._input = input;
        this._output = output;
    }

    get selectSize () {
        return this._decoder._selectSize;
    }

    get inputsCount () {
        return this._decoder._channelsCount;
    }

    get inputSelect () {
        return this._decoder._channelSelect;
    } 

    get input () {
        return this._input;
    }

    get output () {
        return this._output;
    }
}

module.exports = MUX;