const arraysIntersects = require("../routine/arraysIntersects");

class NameTable {
    constructor (addrSpace, names = {}) {
        this._addrSpace = addrSpace;
        this._names = names;
    }

    has (name) {
        return this._names.hasOwnProperty(name);
    }

    add (name, addr) {
        if (addr >= this._addrSpace || addr < 0) throw new RangeError(`Address ${addr} is out range.`);
        this._names[name] = addr;
    }

    deleteName (name) {
        delete this._names[name];
    }

    getAddr (name) {
        if (!this.has(name)) throw new Error(`Name ${name} is not defined`);
        return this._names[name];
    }

    merge (nameTable) {
        if (arraysIntersects(Object.keys(this._names), Object.keys(nameTable._names))) {
            throw new Error("Name table's name sets can't intersects.");
        }

        if (this._addrSpace !== nameTable._addrSpace) throw new Error("Tables to be merged must have the same address spaces.");

        let resNames = {};
        Object.assign(resNames, this._names, nameTable._names);
        return new NameTable(this._addrSpace, resNames);
    }

    get names () {
        return Object.keys(this._names);
    }
}

module.exports = NameTable;