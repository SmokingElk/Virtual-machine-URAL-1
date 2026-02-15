const Part = require("./part");
const Port = require("./port");
const MUXPort = require("./muxPort");
const DTriggerPort = require("./dTriggerPort");
const Decoder = require("./decoder");

class RegisterFile extends Part {
    constructor (scheme, {registersCount, registerSize, readChannelsCount, writeAlways = []}) {
        super(scheme);

        this._registersCount = registersCount;
        this._registerSize = registerSize;
        this._readChannelsCount = readChannelsCount;

        this._clk = this.add("or");
        this._allowWrite = this.add("or");

        let writeConditionally = this.add("and");
        let writeConditionless = this.add("or");

        this._clk.connect(writeConditionally);
        this._clk.connect(writeConditionless);
        this._allowWrite.connect(writeConditionally);

        this._writeSelect = new Decoder(scheme, registersCount);
        this._write = new Port(scheme, registerSize, "or");
        this._outputMUXs = [];

        for (let i = 0; i < readChannelsCount; i++) {
            this._outputMUXs.push(new MUXPort(scheme, registersCount, registerSize));
        }

        this._dTriggerPorts = [];

        for (let i = 0; i < registersCount; i++) {
            let dTriggerPort = new DTriggerPort(scheme, registerSize);
            this._dTriggerPorts.push(dTriggerPort);
            
            for (let j of this._outputMUXs) dTriggerPort.output.connect(j.input(i));

            if (writeAlways.includes(i)) {
                dTriggerPort.clk.addSource(writeConditionless);
                continue;
            }

            this.write.connect(dTriggerPort.input);
            dTriggerPort.clk.addSource(this._writeSelect.channels.elem(i));
            dTriggerPort.clk.addSource(writeConditionally);
        }
    }

    get registersCount () {
        return this._registersCount;
    }

    get registerSize () {
        return this._registerSize;
    }

    get readChannelsCount () {
        return this._readChannelsCount;
    }

    get selectSize () {
        return this._writeSelect.selectSize;
    }

    get write () {
        return this._write;
    }

    get writeSelect () {
        return this._writeSelect.channelSelect;
    }

    readSelect (index) {
        if (index < 0 || index >= this.readChannelsCount) throw new RangeError(`Read channel index ${index} is out of range.`);
        return this._outputMUXs[index].inputSelect;
    }

    read (index) {
        if (index < 0 || index >= this.readChannelsCount) throw new RangeError(`Read channel index${index} is out of range.`);
        return this._outputMUXs[index].output;
    }

    register (index) {
        if (index < 0 || index >= this.registersCount) throw new RangeError(`Register index ${index} is out of range.`);
        return this._dTriggerPorts[index];
    }

    get clk () {
        return this._clk;
    }

    get allowWrite () {
        return this._allowWrite;
    }
}

module.exports = RegisterFile;