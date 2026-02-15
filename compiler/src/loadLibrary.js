const fs = require("fs");
const config = require("./config");
const parseLines = require("./parseLines");

const loadLibrary = function (name) {
    let path = config.syntax.librariesPath + "/" + name;  
    try {
        return parseLines(fs.readFileSync(path, {encoding: "utf-8"}));
    } catch (err) {
        throw new Error(`File "${name}" not found in library directory.`);
    }
};

module.exports = loadLibrary;