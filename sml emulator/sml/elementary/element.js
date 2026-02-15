class Element {
    constructor (id, getElementState) {   
        this._id = id;
        this._getElementState = getElementState;

        this._state = false;
        this._nextState = false;
        this._sources = [];
        this._optimized = false;
    }

    get id () {
        return this._id;
    }

    get state () {
        return this._state;
    }

    get sourcesCount () {
        return this._sources.length;
    }

    get entrySignals () {
        let signals = {};
        let getElementState = this._getElementState;
        let sources = this._sources;

        signals[Symbol.iterator] = () => {
            let current = 0;

            return { next () {
                if (current >= sources.length) return { done: true };

                return {
                    done: false,
                    value: getElementState(sources[current++]),
                };
            } };
        };

        return signals;
    }

    addSource (element) {
        if (this._optimized) throw new Error("Optimized element can't be changed");
        if (this._sources.includes(element.id)) return;
        if (element.id === this.id) throw new Error("Attempt to connect element to itself.");
        if (element._sources.includes(this.id)) throw new Error("Element can not be connected to it's source.");
        this._sources.push(element.id);
    }

    connect (element) {
        element.addSource(this);
    }

    _getCalcNextState (sources, getElementState, calcDefault) {
        return calcDefault;
    }

    _calcNextState () {}

    _update () {
        this._state = this._nextState;
    }

    optimize () {
        this._calcNextState = this._getCalcNextState(this._sources, this._getElementState, this._calcNextState);
        this._optimized = true;
    }
}

module.exports = Element;