const Screen = require("./external devices/screen");
const Scheme = require("./sml/scheme");
const URAL1 = require("./ural1/ural1");
const fs = require("fs");

const pixelSign = String.fromCharCode(0x25A0);

const scheme = new Scheme();
const ural1 = new URAL1(scheme);
const screen = new Screen(scheme, 32, 32, " " + pixelSign);

ural1.AO.connect(screen.inputX);
ural1.BO.connect(screen.inputY);
ural1.AO.slice(6, 8).connect(screen.inputMode);

const programm = new Uint8Array(fs.readFileSync("../programms_compiled/renderer.ur1mc"));
ural1.flash(programm);
ural1.active.on();

scheme.optimize();

scheme.ticks(55);

let clocks = 0;
while (true) {
    console.log(new Array(30).fill("\n").join(""), ural1.IP.output.readNum() + "\n" + screen.image);
    scheme.ticks(128);
}