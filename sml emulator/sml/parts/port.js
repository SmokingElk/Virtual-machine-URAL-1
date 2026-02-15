const { Gate } = require("../elementary/gates");
const Switch = require("../elementary/switch");
const Timer = require("../elementary/timer");
const Part = require("./part");

class Port extends Part {
    constructor (scheme, size, elements = "or") {
        super(scheme);
        this._size = size;
        this._elements = [];

        if (Array.isArray(elements)) {
            this._elements = elements.slice(0);    
        } else {
            for (let i = 0; i < this._size; i++) this._elements.push(this.add(elements));
        } 
    }

    map (handler) {
        return this._elements.map(handler);
    }

    forEach (handler) {
        this._elements.forEach(handler);
    }

    get size () {
        return this._size;
    }

    get elements () {
        return this._elements;
    }

    readNum () {
        let res = 0;
        for (let i = 0; i < this.size; i++) {
            res += Number(this.elem(i).state) * 2**i;
        }

        return res;
    }

    slice (sliceFrom, sliceTo) {
        if (sliceFrom >= sliceTo) throw new Error(`Port slice must have positive length. Got: ${sliceFrom}, ${sliceTo}`);
        return new Port(this.scheme, sliceTo - sliceFrom, this._elements.slice(sliceFrom, sliceTo));
    }

    elem (index) {
        if (index < 0 || index >= this.size) throw new RangeError(`Element index ${index} is out of range.`);
        return this.elements[index];
    }

    connect (target, offset = 0) {
        if (target instanceof Port) {
            if (this.size > target.size) offset = 0;

            let busWidth = Math.min(this.size, target.size);

            if (offset + busWidth > target.size) busWidth = target.size - offset;
            if (busWidth < 0) return;

            for (let i = 0; i < busWidth; i++) this.elem(i).connect(target.elem(i + offset));
            return;
        }
        
        if (target instanceof Gate) {
            this.forEach(e => e.connect(target));
            return;
        }

        if (target instanceof Timer) {
            if (this.size !== 1) throw new Error("Port with more than 1 element can not be connected to timer.");

            this.elements[0].connect(target);
            return;
        }
    }

    addSource (source) {
        if (source instanceof Port) {
            let busWidth = Math.min(this.size, source.size);

            for (let i = 0; i < busWidth; i++) this.elem(i).addSource(source.elem(i));
            return;
        }

        if (source instanceof Gate || source instanceof Timer || source instanceof Switch) {
            this.forEach(e => e.addSource(source));
            return;
        }
    }

    toString () {
        return "0b" + this.map(e => Number(e.state)).reverse().join("");
    }
}

module.exports = Port;