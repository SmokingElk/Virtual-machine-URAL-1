const config = require("./config");

const makeInfoMessage = function (info, showExtendedInfo) {
    let staticUsedPercent = Math.ceil(info.staticUsed / config.hardware.dataCapacity * 100);
    let flashUsedPercent = Math.ceil(info.flashUsed / config.hardware.instructionsCapacity * 100);

    let basicInfo = `Compiled and saved!

Programm uses:
${info.staticUsed} bytes (${staticUsedPercent}%) of data memory
${info.flashUsed * config.hardware.instructionSize} bytes (${flashUsedPercent}%) of programm memory

${config.hardware.dataCapacity - info.staticUsed} bytes left for dynamic memory allocation.`;

    if (!showExtendedInfo) return basicInfo;
    
    let additionalInfo = `
    
Instructions bytes:
${info.instructionsBytes.join("\n")}`;

    return basicInfo + additionalInfo;
};

module.exports = makeInfoMessage;