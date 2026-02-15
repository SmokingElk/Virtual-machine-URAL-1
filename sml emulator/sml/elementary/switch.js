const Element = require("./element");

class Switch extends Element {
    constructor (id, getElementState, initialState) {
        super(id, getElementState);
        this.set(initialState ?? false);
    }

    on () {
        this._nextState = true;
    }

    off () {
        this._nextState = false;
    }

    toggle () {
        this._nextState = !this._nextState;
    }

    set (state) {
        this._nextState = Boolean(state);
    }

    addSource () {
        throw new Error("Switch element can not have any sources.");
    }
}

module.exports = Switch;