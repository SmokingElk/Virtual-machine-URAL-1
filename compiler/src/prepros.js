const loadLibrary = require("./loadLibrary");
const { toBin } = require("./routine/binaryOperations");
const config = require("./config");

const directives = {
    define: (text, rep, ...valParts) => {
        let val = valParts.join(" ");
        return text
        .replaceAll(new RegExp(`([^a-zA-Z0-9])${rep}([^a-zA-Z0-9])`, "g"), (_, preS, postS) => preS + val + postS)
        .replaceAll(new RegExp(`^${rep}([^a-zA-Z0-9])`, "g"), (_, postS) => val + postS)
        .replaceAll(new RegExp(`([^a-zA-Z0-9])${rep}$`, "g"), (_, preS) => preS + val);
    } 
};

const hexMacro = function (hexStr) {
    let nmb = Number.parseInt(hexStr.split("x")[1], 16) % 2**config.hardware.machineWord;
    return toBin(nmb, config.hardware.machineWord);
};

const decMacro = function (decStr) {
    let nmb = Number(decStr.split("d")[1]) % 2**config.hardware.machineWord;
    return toBin(nmb, config.hardware.machineWord);
};

const binMacro = function (binStr) {
    let res = binStr.split("b")[1];
    while (res.length < config.hardware.machineWord) res = "0" + res;
    return res;
};

const bitMacro = function (text, rev = false) {
    let nmb = (Number(text.replaceAll("bit(", "").replaceAll("rbt(", "").replaceAll(")", ""))) % config.hardware.machineWord;
    let res = [];

    while (res.length < config.hardware.machineWord) res.push(rev ? "1" : "0");
    res[(config.hardware.machineWord - 1 - nmb) % config.hardware.machineWord] = rev ? "0" : "1";
    
    return res.join("");
};

const insertDependencies = function (lines) {
    let res = [];

    for (let line of lines) {
        if (!line.startsWith(config.syntax.preprosDirectivePrefix + config.syntax.includeDirective)) {
            res.push(line);
            continue;
        }

        let [_, libNameRaw] = line.split(" ");
        let libName = libNameRaw.replaceAll("<", "").replaceAll(">", "");

        let libraryLines = loadLibrary(libName);
        res = res.concat(libraryLines);
    }

    return res;
};

const prepros = function (textSrc) {
    let text = insertDependencies(textSrc).join("\n");

    text = text.replaceAll(/0x[\dA-F]+/g, e => hexMacro(e));
    text = text.replaceAll(/0d\-?\d+/g, e => decMacro(e));
    text = text.replaceAll(/0b[01]+/g, e => binMacro(e));

    for (let i of text.split("\n")) {
        if (!i.startsWith(config.syntax.preprosDirectivePrefix)) continue;

        let parts = i.slice(1).split(" ");
        if (!directives.hasOwnProperty(parts[0])) throw new Error(`Unknown directive: ${parts[0]}.`);

        text = directives[parts[0]](text, ...parts.slice(1));
        text = directives[parts[0]](text, ...parts.slice(1));
    }

    text = text.replaceAll(config.syntax.newLineMacroSymbol, "\n");
    text = text.replaceAll(/bit\(\d+\)/g, e => bitMacro(e));
    text = text.replaceAll(/rbt\(\d+\)/g, e => bitMacro(e, true));

    let codeLines = text.split("\n").filter(e => !e.startsWith(config.syntax.preprosDirectivePrefix));
    return codeLines;  
};

module.exports = prepros;