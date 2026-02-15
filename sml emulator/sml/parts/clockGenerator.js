const Part = require("./part");

class ClockGenerator extends Part {
    constructor (scheme, halfPeriod) {
        super(scheme);

        this._halfPeriod = halfPeriod + 4;

        this._active = this.add("and");
        this._output = this.add("timer", halfPeriod);
        let outputRev = this.add("nor");

        this._active.connect(this._output);
        this._output.connect(outputRev);
        outputRev.connect(this._active);
    }

    get halfPeriod () {
        return this._halfPeriod;
    }

    get period () {
        return this._halfPeriod * 2;
    }

    get clockFrequency () {
        return 1 / this.period;
    }

    get active () {
        return this._active;
    }

    get clk () {
        return this._output;
    }
}

module.exports = ClockGenerator;