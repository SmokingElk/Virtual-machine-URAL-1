const Element = require("./element");

class Timer extends Element {
    constructor (id, getElementState, delay) {
        super(id, getElementState);
        
        this._counted = 0;
        this._delay = delay + 1;
    }

    get delay () {
        return this._delay;
    }

    addSource (element) {
        if (this._sources >= 1) throw new Error("Timer can only have one source.");
        this._sources.push(element.id);
    }

    _calcNextState () {
        let active = false;
        for (let i of this.entrySignals) {
            active = i;
            if (i) break;
        }

        this._nextState = this.state;

        if (active) {
            if (this._counted >= this.delay) this._nextState = true;
            else this._counted++;
            return;
        }

        if (this._counted <= 0) return this._nextState = false;
        this._counted--;
    }
}

module.exports = Timer;