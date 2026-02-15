const { VPart, Port } = require("../sml/sml");

const modes = {
    0: "idle",
    1: "clearPixel",
    2: "fillPixel",
    3: "blit",
};

class Screen extends VPart {
    constructor (scheme, width, height, cols = " x") {
        super(scheme);
        
        this._width = width;
        this._height = height;
        this._cols = cols;

        this._frameBuffer = [];
        for (let i = 0; i < height; i++) {
            this._frameBuffer.push(new Array(width).fill(0));
        }

        this._pixels = [];
        for (let i = 0; i < height; i++) {
            this._pixels.push(new Array(width).fill(0));
        }

        this._inputX = new Port(scheme, Math.ceil(Math.log2(width)), "or");
        this._inputY = new Port(scheme, Math.ceil(Math.log2(height)), "or");
        this._inputMode = new Port(scheme, 2, "or");

        this._nextMode = "idle";
        this._nextX = 0;
        this._nextY = 0;
    }

    get inputMode () {
        return this._inputMode;
    }

    get inputX () {
        return this._inputX;
    }

    get inputY () {
        return this._inputY;
    }

    get image () {
        let horizontalBorder = "+" + new Array(2 * this._width - 1).fill("-").join("") + "+";
        let res = [horizontalBorder];

        for (let i = 0; i < this._height; i++) {
            let row = [];

            for (let j = 0; j < this._width; j++) {
                row.push(this._cols[this._pixels[i][j]]);
            }

            res.push("|" + row.join(" ") + "|");
        }

        res.push(horizontalBorder);

        return res.join("\n");
    }

    blit () {
        for (let i = 0; i < this._height; i++) {
            for (let j = 0; j < this._width; j++) {
                this._pixels[i][j] = this._frameBuffer[i][j];
            }
        }
    }

    setPixel (x, y, value) {
        this._frameBuffer[y][x] = value;
    }

    _calcNextState () {
        this._nextX = this._inputX.readNum();
        this._nextY = this._inputY.readNum();
        this._nextMode = modes[this._inputMode.readNum()];
    }

    _update () {
        if (this._nextMode === "clearPixel") this.setPixel(this._nextX, this._nextY, 0);
        if (this._nextMode === "fillPixel") this.setPixel(this._nextX, this._nextY, 1); 
        if (this._nextMode === "blit") this.blit();
    }
}

module.exports = Screen;