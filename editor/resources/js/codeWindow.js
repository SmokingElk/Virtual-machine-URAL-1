(() => {

//класс файла
class CodeWindow {
	constructor () {
		this.input = document.getElementById("code_input");
		this.textField = document.getElementById("code_text");
		this.linesNum = document.getElementById("lines_num");

		this.highlighter = new Highlighter();
		this.defineEventListeners();
	};

	focus () {
		this.input.focus();
	};

	set text (newText) {
		this.input.value = newText;
		this.updateText();
	};

	get text () {
		return this.input.value;
	};

	paste (substr) {
		let selStart = this.input.selectionStart;
		let shift = substr.length;

		let newText = this.text.slice(0, selStart) + substr + this.text.slice(selStart);
		this.text = newText;
		this.focus();

		this.input.selectionStart = this.input.selectionEnd = selStart + shift;
	};

	onkeydown (e) {
		let code = e.code;
		let ctrl = e.ctrlKey;
		let shift = e.shiftKey;

		if (code === "Tab") {
			this.paste("\t");
			this.updateText();
			return;
		} 

		if (code === "Enter" && shift) {
			e.preventDefault();
			this.paste("\n\t");
			this.updateText();
			return;
		}
	};

	updateText () {
		this.textField.innerHTML = this.highlighter.highlight(this.text);

		let linesNumText = "";
		for (let i = 0; i < this.text.split("\n").length; i++) linesNumText += `${i + 1}\n`;
		this.linesNum.innerHTML = linesNumText;
	};

	defineEventListeners () {
		this.input.addEventListener("input", e => this.updateText());
		this.input.addEventListener("keydown", e => this.onkeydown(e));
		this.input.addEventListener("paste", e => this.updateText());
	};
};

// экспорт
window.CodeWindow = CodeWindow;

})();