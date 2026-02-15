const Part = require("./part");

class DLatch extends Part {
    constructor (scheme) {
        super(scheme);
        
        let input = this.add("or");
        let clk = this.add("and");
        let output = this.add("and");

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
        let wrsJoin = this.add("and");

        writeGateFor.connect(wrsSet);
        writeGateRev.connect(wrsReset);
        wrsSet.connect(wrsJoin);
        wrsReset.connect(wrsJoin);
        wrsJoin.connect(output);
        output.connect(wrsSet);

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

module.exports = DLatch;