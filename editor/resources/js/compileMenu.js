(() => {

const fs = require("fs");

const compileMenuContainer = document.querySelector(".popup_container");
const compileMenuCloseBtn = document.querySelector(".popup_close");
const textareas = Array.from(document.querySelectorAll(".path_field"));

const assemblerPath = document.getElementById("assembler_path");
const resultPath = document.getElementById("result_path");

const compileBtn = document.getElementById("compile_btn");
const compileOut = document.getElementById("compile_out");

const compileMenuToggle = function () {
    compileMenuContainer.classList.toggle("_show");  
};

const compileMenuOpen = function () {
    compileMenuContainer.classList.add("_show");  
};

const compileMenuClose = function () {
    compileMenuContainer.classList.remove("_show");  
};

const checkPath = function (path) {
    return fs.existsSync(path);
};

const colorizePathInput = function (field) {
    let isCorrect = checkPath(field.value.trim());
    field.classList.add(isCorrect ? "_all_right" : "_error");
    field.classList.remove(isCorrect ? "_error" : "_all_right");
};

const getAssemblerPath = () => assemblerPath.value.trim();
const getResultPath = () => resultPath.value.trim();
const setCompileOut = text => compileOut.textContent = text;
const isCompileMenuOpen = () => compileMenuContainer.classList.contains("_show");

compileMenuCloseBtn.addEventListener("click", compileMenuClose);

textareas.forEach(e => {
    let id = e.getAttribute("id");
    e.value = localStorage.getItem(`${id}_value`) ?? "";
    colorizePathInput(e);
});

textareas.forEach(e => e.addEventListener("input", () => {
    let id = e.getAttribute("id");
    localStorage.setItem(`${id}_value`, e.value);
    colorizePathInput(e);
}));

window.compileMenuToggle = compileMenuToggle;
window.compileMenuOpen = compileMenuOpen;
window.compileMenuClose = compileMenuClose;
window.getAssemblerPath = getAssemblerPath;
window.getResultPath = getResultPath;
window.setCompileOut = setCompileOut;
window.isCompileMenuOpen = isCompileMenuOpen;
window.checkPath = checkPath;
window.compileBtn = compileBtn;

})();