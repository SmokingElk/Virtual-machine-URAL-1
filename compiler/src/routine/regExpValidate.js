const regExpValidate = function (str, regExp) {
    let match = str.match(regExp);
    if (match === null) return false;
    return match[0] === str;
};

module.exports = regExpValidate;