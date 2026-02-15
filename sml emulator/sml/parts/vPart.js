const Part = require("./part");

class VPart extends Part {
    constructor (scheme) {
        super(scheme);
        scheme.registerVPart(this);
    }

    _calcNextState () {}
    _update () {}
}

module.exports = VPart;