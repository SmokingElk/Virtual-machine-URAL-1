const { Part, MUX } = require("../sml/sml");
const { compareModeCodes } = require("./config");

class ComparatorsBlock extends Part {
    constructor (scheme) {
        super(scheme);

        this._lessInput = this.add("or");
        this._equalInput = this.add("or");
        this._overflowInput = this.add("or");

        this._modeMUX = new MUX(scheme, 8);

        let notEqual = this.add("nor");
        let notOverflow = this.add("nor");
        let lessOrEqual = this.add("or");
        let more = this.add("nor");
        let moreOrEqual = this.add("nor");

        this.lessInput.connect(moreOrEqual);
        this.equalInput.connect(notEqual);
        this.overflowInput.connect(notOverflow);

        this.lessInput.connect(lessOrEqual);
        this.equalInput.connect(lessOrEqual);
        lessOrEqual.connect(more);

        this._modeMUX.input.elem(compareModeCodes.EQ).addSource(this.equalInput);
        this._modeMUX.input.elem(compareModeCodes.NE).addSource(notEqual);
        this._modeMUX.input.elem(compareModeCodes.LT).addSource(this.lessInput);
        this._modeMUX.input.elem(compareModeCodes.LE).addSource(lessOrEqual);
        this._modeMUX.input.elem(compareModeCodes.MT).addSource(more);
        this._modeMUX.input.elem(compareModeCodes.ME).addSource(moreOrEqual);
        this._modeMUX.input.elem(compareModeCodes.OV).addSource(this.overflowInput);
        this._modeMUX.input.elem(compareModeCodes.NOV).addSource(notOverflow);
    }

    get selectSize () {
        return this._modeMUX.selectSize;
    }

    get modesCount () {
        return this._modeMUX.inputsCount;
    }

    get lessInput () {
        return this._lessInput;
    }

    get equalInput () {
        return this._equalInput;
    }

    get overflowInput () {
        return this._overflowInput;
    }

    get modeSelect () {
        return this._modeMUX.inputSelect;
    }

    get output () {
        return this._modeMUX.output;
    }
}

module.exports = ComparatorsBlock;