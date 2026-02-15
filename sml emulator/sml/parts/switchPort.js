const Port = require("./port");

class SwitchPort extends Port {
    constructor (scheme, size) {
        super(scheme, size, "switch");
    }

    writeNum (num) {
        for (let i = 0; i < this.size; i++) {
            this.elem(i).set((1 << i) & num);
        } 
    }
}

module.exports = SwitchPort;