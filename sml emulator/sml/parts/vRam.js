const VPart = require("./vPart");
const Port = require("./port");
const SwitchPort = require("./switchPort");

class VRAM extends VPart {
    constructor (scheme, {capacity, cellSize, readChannels, needAccess = []}) {
        super(scheme);

        this._capacity = capacity;
        this._cellSize = cellSize;
        this._readChannelsCount = readChannels.length;
        this._readChannels = readChannels;
        this._needAccess = needAccess;

        this._cellsArray = new Array(capacity).fill(0);

        this._outputAddrs = new Array(this.readChannelsCount).fill(0);
        this._writeAddr = 0;
        this._writeNext = 0;
        this._needWrite = false;

        this._clk = this.add("or");
        this._allowWrite = this.add("or");

        let writeSelectSize = Math.ceil(Math.log2(capacity));
        this._writeSelect = new Port(scheme, writeSelectSize, "or");
        this._write = new Port(scheme, cellSize, "or");

        this._outputSelects = readChannels.map(e => this._makeOutputSelect(e));
        this._outputPorts = readChannels.map(e => new SwitchPort(scheme, cellSize * e.width, "or"));

        this._rightAccessPorts = {};
        for (let i of this._needAccess) this._rightAccessPorts[i] = new SwitchPort(scheme, this.cellSize);
    }

    get maxNum () {
        return 2**this._cellSize;
    }

    _makeOutputSelect ({width, offset = 0}) {
        let virtualCapacity = (Math.max(0, this.capacity - offset) / width) | 0;
        let selectSize = Math.ceil(Math.log2(virtualCapacity));
        return new Port(this.scheme, selectSize, "or");
    }

    _calcNextState () {
        this._outputAddrs = this._readChannels.map(({width, offset = 0}, i) => {
            return offset + this._outputSelects[i].readNum() * width;
        });

        this._writeAddr = this._writeSelect.readNum();
        this._writeNext = this._write.readNum();
        this._needWrite = this.clk.state && this.allowWrite.state;
    }

    _update () {
        this._readChannels.forEach(({width}, i) => {
            let num = 0;
            let base = this.maxNum;

            for (let j = 0; j < width; j++) {
                let cellAddr = this._outputAddrs[i] + j;
                num += this._cellsArray[cellAddr] * base**(width - j - 1);
            } 

            this._outputPorts[i].writeNum(num);
        });

        if (this._needWrite) {
            this._cellsArray[this._writeAddr] = this._writeNext;
        }

        for (let i of this._needAccess) {
            this._rightAccessPorts[i].writeNum(this._cellsArray[i]);
        }
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
        return this._writeSelect.size;
    }

    readSelectSize (index) {
        if (index < 0 || index >= this.readChannelsCount) throw new RangeError(`Read channel index ${index} is out of range.`);
        return this._outputSelects[index].size;
    }

    get writeSelect () {
        return this._writeSelect;
    }

    get write () {
        return this._write;
    }

    readSelect (index) {
        if (index < 0 || index >= this.readChannelsCount) throw new RangeError(`Read channel index ${index} is out of range.`);
        return this._outputSelects[index];
    }

    read (index) {
        if (index < 0 || index >= this.readChannelsCount) throw new RangeError(`Read channel index ${index} is out of range.`);
        return this._outputPorts[index];
    }

    rightAccess (index) {
        if (index < 0 || index >= this.capacity) throw new RangeError(`Cell index ${index} is out of range.`);
        if (!this._needAccess.includes(index)) throw new Error(`Cell with index ${index} doesn't have right access.`);
        return this._rightAccessPorts[index];
    }

    get clk () {
        return this._clk;
    }

    get allowWrite () {
        return this._allowWrite;
    }

    flash (data) {
        let maxNum = this.maxNum;

        for (let i = 0; i < data.length; i++) {
            if (i >= this.capacity) break;
            this._cellsArray[i] = Math.max(0, data[i] % maxNum) | 0;
        }          
    }
}

module.exports = VRAM;