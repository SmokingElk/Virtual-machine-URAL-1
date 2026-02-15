const Decoder = require("./decoder");
const Part = require("./part");
const Port = require("./port");

class DMUX extends Part {
    constructor (scheme, outputsCount) {
        super(scheme);
        
        let decoder = new Decoder(scheme, outputsCount);
        let input = this.add("or");
        let output = new Port(scheme, outputsCount, "and");

        decoder.channels.connect(output);
        output.addSource(input);

        this._decoder = decoder;
        this._input = input;
        this._output = output;
    }

    get selectSize () {
        return this._decoder._selectSize;
    }

    get outputsCount () {
        return this._decoder._channelsCount;
    }

    get outputSelect () {
        return this._decoder._channelSelect;
    } 

    get input () {
        return this._input;
    }

    get output () {
        return this._output;
    }
}

module.exports = DMUX;