const { Buffer } = require("buffer");
const config = require("./config");
const getSegments = require("./getSegments");
const parseLines = require("./parseLines");
const prepros = require("./prepros");
const { toBin } = require("./routine/binaryOperations");

const compile = function (text) {
    const lines = parseLines(text);
    const libsInclude = config.autoInclude.map(e => {
        return `${config.syntax.preprosDirectivePrefix}${config.syntax.includeDirective} <${e}>`;
    });

    const linesPreprocessed = prepros(libsInclude.concat(lines));

    const [dataSegment, codeSegment] = getSegments(linesPreprocessed);

    const dataInternal = dataSegment.parseData();
    const instructionsInternal = codeSegment.compileInstructions(dataSegment.memoryUsed, dataSegment.nameTable);

    let info = {
        staticUsed: dataSegment.memoryUsed,
        flashUsed: codeSegment.memoryUsed,
        instructionsBytes: [],
    };

    for (let i = 0; i < instructionsInternal.length; i += 3) {
        let line = instructionsInternal.slice(i, i + 3).map(e => toBin(e, config.hardware.machineWord)).join(" ");
        info.instructionsBytes.push(line);
    }

    while (instructionsInternal.length < config.hardware.instructionsCapacity * config.hardware.instructionSize) {
        instructionsInternal.push(0);
    }  

    while (dataInternal.length < config.hardware.dataCapacity - 1) dataInternal.push(0);    
    dataInternal.push(codeSegment.nameTable.getAddr(config.syntax.isrName));

    let programmCompiled = Buffer.from(instructionsInternal.concat(dataInternal));

    return [programmCompiled, info];
}

module.exports = compile;