const { AndGate, OrGate, XorGate, NandGate, NorGate, XnorGate } = require("./elementary/gates");
const Timer = require("./elementary/timer");
const Switch = require("./elementary/switch");

const defaultNameList = {
    "and": AndGate,
    "or": OrGate,
    "xor": XorGate,
    "nand": NandGate,
    "nor": NorGate,
    "xnor": XnorGate,
    "timer": Timer,
    "switch": Switch,  
};

class Scheme {
    constructor (elementsNameList = defaultNameList) {
        this._elements = [];
        this._vParts = [];
        this._elementsNameList = elementsNameList;
        this._optimized = false;
    }

    get elementsCount () {
        return this._elements.length;
    }

    getElementState (id) {
        if (id >= this._elements.length) throw new Error(`Element with id ${id} does not exist.`);
        return this._elements[id].state;
    }

    add (name, ...elArgs) {
        if (this._optimized) throw new Error("Optimized scheme can't be changed.");
        if (!this._elementsNameList.hasOwnProperty(name)) throw new ReferenceError(`Name '${name}' is not defined.`);

        let element = new this._elementsNameList[name](this._elements.length, this.getElementState.bind(this), ...elArgs);
        this._elements.push(element);
        return element;
    }

    registerVPart (vPart) {
        this._vParts.push(vPart);
    }

    tick () {
        for (let i of this._elements) i._calcNextState();
        for (let i of this._vParts) i._calcNextState();
        for (let i of this._elements) i._update();
        for (let i of this._vParts) i._update();
    }

    ticks (ticksCount) {
        for (let i = 0; i < ticksCount; i++) this.tick();
    }

    optimize () {
        for (let i of this._elements) i.optimize();
        this._optimized = true;
    }
}

module.exports = Scheme;