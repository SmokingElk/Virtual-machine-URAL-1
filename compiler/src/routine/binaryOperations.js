const getComplement = function (rawNmb, digits) {
    let maxNum = 2**digits;
    return (maxNum + rawNmb) % 256;
};

const toBin = function (rawNmb, digits) {
    let nmb = Math.abs(Math.floor(rawNmb));
    if (rawNmb < 0) nmb = getComplement(-nmb, digits);

    let res = "";
    while (nmb > 0) {
        res = String(nmb % 2) + res;
        nmb = Math.floor(nmb / 2);
    }

    while (res.length < digits) res = "0" + res;

    return res;
};

module.exports = {
    getComplement,
    toBin,
};