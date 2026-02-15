const Part = require("./part");
const Decoder = require("./decoder");
const Port = require("./port");

class MUXPort extends Part {
	constructor (scheme, inputsCount, portSize) {
		super(scheme);

		let decoder = new Decoder(scheme, inputsCount);
		let output = new Port(scheme, portSize, "or");

		this._decoder = decoder;
		this._inputs = [];
		this._output = output;

		for (let i = 0; i < inputsCount; i++) {
			let input = new Port(scheme, portSize, "and");
			input.addSource(decoder.channels.elem(i));
			input.connect(output);
			this._inputs.push(input);
		}
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

	input (index) {
		if (index < 0 || index >= this.inputsCount) throw new RangeError(`Input index ${index} is out of range.`);
		return this._inputs[index];
	}

	get output () {
        return this._output;
    }
}

module.exports = MUXPort;