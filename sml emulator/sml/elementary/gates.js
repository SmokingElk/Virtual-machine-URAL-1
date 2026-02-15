const Element = require("./element");

class Gate extends Element {
    _calcNextState () {
        this._nextState = Boolean(this._signalFunction(this.entrySignals, this.sourcesCount));
    }
}

class AndGate extends Gate {
    _signalFunction (entrySignals, sourcesCount) {
        if (sourcesCount == 0) return false;

        for (let i of entrySignals) {
            if (!i) return false;
        }

        return true;
    }

    _getCalcNextState (sources, getElementState, calcDefault) {
        if (sources.length === 0) return () => {};
        if (sources.length === 1) return () => this._nextState = getElementState(sources[0]);
        if (sources.length === 2) return () => this._nextState = getElementState(sources[0]) && getElementState(sources[1]);
        return calcDefault;
    }
}

class OrGate extends Gate {
    _signalFunction (entrySignals, sourcesCount) {
        for (let i of entrySignals) {
            if (i) return true;
        }

        return false;
    }

    _getCalcNextState (sources, getElementState, calcDefault) {
        if (sources.length === 0) return () => {};
        if (sources.length === 1) return () => this._nextState = getElementState(sources[0]);
        if (sources.length === 2) return () => this._nextState = getElementState(sources[0]) || getElementState(sources[1]);
        return calcDefault;
    }
}

class XorGate extends Gate {
    _signalFunction (entrySignals, sourcesCount) {
        let sum = 0;
        for (let i of entrySignals) sum += i;
        return sum % 2;
    };

    _getCalcNextState (sources, getElementState, calcDefault) {
        if (sources.length === 0) return () => {};
        if (sources.length === 1) return () => this._nextState = getElementState(sources[0]);
        if (sources.length === 2) return () => {
            this._nextState = Boolean((getElementState(sources[0]) + getElementState(sources[1])) % 2);
        };

        return calcDefault;
    }
};

class NandGate extends Gate {
    _signalFunction (entrySignals, sourcesCount) {
        for (let i of entrySignals) {
            if (!i) return true;
        }

        return false;
    }

    _getCalcNextState (sources, getElementState, calcDefault) {
        if (sources.length === 0) return () => {};
        if (sources.length === 1) return () => this._nextState = !getElementState(sources[0]);
        if (sources.length === 2) return () => this._nextState = !(getElementState(sources[0]) && getElementState(sources[1]));
        return calcDefault;
    }
}

class NorGate extends Gate {
    _signalFunction (entrySignals, sourcesCount) {
        if (sourcesCount == 0) return false;
        
        for (let i of entrySignals) {
            if (i) return false;
        }

        return true;
    }

    _getCalcNextState (sources, getElementState, calcDefault) {
        if (sources.length === 0) return () => {};
        if (sources.length === 1) return () => this._nextState = !getElementState(sources[0]);
        if (sources.length === 2) return () => this._nextState = !(getElementState(sources[0]) || getElementState(sources[1]));
        return calcDefault;
    }
}

class XnorGate extends Gate {
    _signalFunction (entrySignals, sourcesCount) {
        if (sourcesCount == 0) return false;

        let sum = 1;
        for (let i of entrySignals) sum += i;
        return sum % 2;
    }

    _getCalcNextState (sources, getElementState, calcDefault) {
        if (sources.length === 0) return () => {};
        if (sources.length === 1) return () => this._nextState = getElementState(sources[0]);
        if (sources.length === 2) return () => {
            this._nextState = Boolean((1 + getElementState(sources[0]) + getElementState(sources[1])) % 2);
        };

        return calcDefault;
    }
}

module.exports = {
    Gate,
    AndGate,
    OrGate,
    XorGate,
    NandGate,
    NorGate,
    XnorGate,
};