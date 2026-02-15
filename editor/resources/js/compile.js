(() => {

const { exec } = require("child_process");

const compile = function (asmPath, srcPath, resPath) {
    return new Promise((resolve, reject) => {
        if (!checkPath(asmPath)) resolve("Incorrect assembler path.");
        if (!checkPath(srcPath)) resolve("Incorrect source path.");
        if (!checkPath(resPath)) resolve("Incorrect save path.");

        exec(`node ${asmPath} ${srcPath} ${resPath}`, (error, stdout, stderr) => {
            resolve(error ? stderr : stdout);
        });
    });
};

window.compile = compile;

})();