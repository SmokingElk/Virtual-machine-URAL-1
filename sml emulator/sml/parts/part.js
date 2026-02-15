class Part {
    constructor (scheme) {
        this._scheme = scheme;
    }

    get scheme () {
        return this._scheme;
    }

    add (name, ...args) {
        return this._scheme.add(name, ...args);
    }
}

module.exports = Part;