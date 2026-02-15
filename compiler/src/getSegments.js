const config = require("./config");
const DataSegment = require("./segments/dataSegment");
const CodeSegment = require("./segments/codeSegment");

const getSegments = function (lines) {
    let dataLines = [];
    let codeLines = [];

    let anotherSegmentType = null;
    let anotherSegmentLines = [];

    for (let i of lines) {
        if (!i.startsWith(config.syntax.segmentDeclarationPrefix)) {
            anotherSegmentLines.push(i);
            continue;
        }

        if (anotherSegmentType === config.syntax.segmentsNames.data) dataLines = dataLines.concat(anotherSegmentLines);
        if (anotherSegmentType === config.syntax.segmentsNames.code) codeLines = codeLines.concat(anotherSegmentLines);

        anotherSegmentType = i.replace(config.syntax.segmentDeclarationPrefix, "");
        if (!Object.values(config.syntax.segmentsNames).includes(anotherSegmentType)) {
            throw new Error(`Unknown segment type: ${anotherSegmentType}`);
        }

        anotherSegmentLines = [];
    }

    if (anotherSegmentType === config.syntax.segmentsNames.data) dataLines = dataLines.concat(anotherSegmentLines);
    if (anotherSegmentType === config.syntax.segmentsNames.code) codeLines = codeLines.concat(anotherSegmentLines);

    return [new DataSegment(dataLines), new CodeSegment(codeLines)];
}

module.exports = getSegments;