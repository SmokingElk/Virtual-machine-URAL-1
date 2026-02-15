const config = require("./config");

const parseLines = function (text) {
    let resLines = [];

    for (let i of text.split("\n")) {
        let line = i.trim().replaceAll("\t", "").replaceAll("\r", "").replaceAll(/ +/g, " ");
        if (line.startsWith(config.syntax.comment)) continue;
        if (line !== "") resLines.push(line);
    }

    return resLines;
}

module.exports = parseLines;