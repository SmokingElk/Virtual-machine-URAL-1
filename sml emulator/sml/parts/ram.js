const Decoder = require("./decoder");
const Part = require("./part");
const Port = require("./port");
const DLatchPort = require("./dLatchPort");
const MUXPort = require("./muxPort");

class RAM extends Part {
    constructor (scheme, {capacity, cellSize, readChannels}) {
        super(scheme);

        this._capacity = capacity;
        this._cellSize = cellSize;
        this._readChannelsCount = readChannels.length;

        this._clk = this.add("or");
        this._allowWrite = this.add("or");
        let writeConditionally = this.add("and");

        this._clk.connect(writeConditionally);
        this._allowWrite.connect(writeConditionally);

        this._writeSelect = new Decoder(scheme, capacity);
        this._write = new Port(scheme, cellSize, "or");

        this._dLatchPorts = [];

        for (let i = 0; i < capacity; i++) {
            let dLatchPort = new DLatchPort(scheme, cellSize);
            this._dLatchPorts.push(dLatchPort);

            this.write.connect(dLatchPort.input);
            dLatchPort.clk.addSource(this._writeSelect.channels.elem(i));
            dLatchPort.clk.addSource(writeConditionally);
        }

        this._outputMUXs = readChannels.map(e => this._makeReadChannel(e));
    }

    _makeReadChannel ({width, offset = 0}) {
        let size = width * this.cellSize;
        let virtualCapacity = (Math.max(0, this.capacity - offset) / width) | 0;

        if (virtualCapacity == 0) throw new Error("Anable to make read channel.");

        let muxPort = new MUXPort(this.scheme, virtualCapacity, size);

        for (let i = 0; i < virtualCapacity; i++) {
            let blockAddr = offset + i * width;

            for (let j = 0; j < width; j++) {
                let cellAddr = blockAddr + j;
                this.cell(cellAddr).output.connect(muxPort.input(i), j * this.cellSize);
            }
        }

        return muxPort;
    }

    get capacity () {
        return this._capacity;
    }

    get cellSize () {
        return this._cellSize;
    }

    get readChannelsCount () {
        return this._readChannelsCount;
    }

    get writeSelectSize () {
        return this._writeSelect.selectSize;
    }

    readSelectSize (index) {
        if (index < 0 || index >= this.readChannelsCount) throw new RangeError(`Read channel index ${index} is out of range.`);
        return this._outputMUXs[index].selectSize;
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

    cell (index) {
        if (index < 0 || index >= this.capacity) throw new RangeError(`Cell index ${index} is out of range.`);
        return this._dLatchPorts[index];
    }

    get clk () {
        return this._clk;
    }

    get allowWrite () {
        return this._allowWrite;
    }
}

module.exports = RAM;