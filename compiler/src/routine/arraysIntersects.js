const arraysIntersects = function (array1, array2) {
    for (let i of array1) {
        if (array2.includes(i)) return true;
    }

    return false;
}

module.exports = arraysIntersects;