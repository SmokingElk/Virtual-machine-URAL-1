const Part = require("./part");

class DTrigger extends Part {
    constructor (scheme) {
        super(scheme);

        let input = this.add("or");
        let clk = this.add("and");
        let output = this.add("and");

        let clkRev = this.add("nor");
        clk.connect(clkRev);

        let writeVal = this.add("and");
        let writeRev = this.add("nor");
        input.connect(writeVal);
        input.connect(writeRev);

        let writeGateFor = this.add("and");
        let writeGateRev = this.add("and");

        writeVal.connect(writeGateFor);
        writeRev.connect(writeGateRev);
        clk.connect(writeGateFor);
        clk.connect(writeGateRev);

        let wrsSet = this.add("or");
        let wrsReset = this.add("nor");
        let wrsOut = this.add("and");
        let wrsJoin = this.add("and");

        writeGateFor.connect(wrsSet);
        writeGateRev.connect(wrsReset);
        wrsSet.connect(wrsJoin);
        wrsReset.connect(wrsJoin);
        wrsJoin.connect(wrsOut);
        wrsOut.connect(wrsSet);

        let readRev = this.add("nor");
        wrsOut.connect(readRev);

        let readGateFor = this.add("and");
        let readGateRev = this.add("and");

        wrsOut.connect(readGateFor);
        readRev.connect(readGateRev);
        clkRev.connect(readGateFor);
        clkRev.connect(readGateRev);

        let rrsSet = this.add("or");
        let rrsReset = this.add("nor");
        let rrsJoin = this.add("and");

        readGateFor.connect(rrsSet);
        readGateRev.connect(rrsReset);
        rrsSet.connect(rrsJoin);
        rrsReset.connect(rrsJoin);
        rrsJoin.connect(output);
        output.connect(rrsSet);

        this._input = input;
        this._clk = clk;
        this._output = output;
    }

    get input () {
        return this._input;
    }

    get output () {
        return this._output;
    }

    get clk () {
        return this._clk;
    }
}

module.exports = DTrigger;