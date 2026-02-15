const Decoder = require("./decoder");
const Part = require("./part");

class ControlUnit extends Part {
    constructor (scheme, truthTable) {
        super(scheme);

        this._opCodesCount = truthTable.length - 1;
        this._outputsCount = truthTable[0].length;
        
        this._decoder = new Decoder(scheme, this.opCodesCount);
        
        for (let i = 0; i < this.outputsCount; i++) {
            let output = this.add("or");

            for (let j = 0; j < this.opCodesCount; j++) {
                if (truthTable[j + 1][i] === "1") {
                    this._decoder.channels.elem(j).connect(output);
                } 
            }

            Object.defineProperty(this, truthTable[0][i], {
                get: () => output,
            });
        }
    }

    get opCodeSize () {
        return this._decoder.selectSize;
    }

    get opCodesCount () {
        return this._opCodesCount;
    }

    get outputsCount () {
        return this._outputsCount;
    }

    get opCodeInput () {
        return this._decoder.channelSelect;
    }
}

module.exports = ControlUnit;