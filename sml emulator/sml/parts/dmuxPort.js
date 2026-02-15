const Decoder = require("./decoder");
const Part = require("./part");
const Port = require("./port");

class DMUXPort extends Part {
	constructor (scheme, outputsCount, portSize) {
		super(scheme);

		let decoder = new Decoder(scheme, outputsCount);
		let input = new Port(scheme, portSize, "or");

		this._decoder = decoder;
		this._input = input;
		this._outputs = [];

		for (let i = 0; i < outputsCount; i++) {
			let output = new Port(scheme, portSize, "and");
			output.addSource(decoder.channels.elem(i));
			input.connect(output);
			this._outputs.push(output);
		}
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

    output (index) {
		if (index < 0 || index >= this.outputsCount) throw new RangeError(`Output index ${index} is out of range.`);
		return this._inputs[index];
	}
}

module.exports = DMUXPort;