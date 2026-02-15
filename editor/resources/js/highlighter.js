(() => {

//функции
const replacer = (className, replace = "$&") => `<span class="${className}">${replace}</span>`;

//класс файла
class Highlighter {
	constructor () {
		this.masks = this.createMasks();
		this.replacers = this.createReplacers(this.masks);
	};

	createMasks () {
		let commandSorted = config.command.sort((a, b) => {
			if (a.length < b.length) return 1;
			if (a.length > b.length) return -1;
			return 0;
		});

		let macroSorted = config.macroNames.sort((a, b) => {
			if (a.length < b.length) return 1;
			if (a.length > b.length) return -1;
			return 0;
		});

		let asmFuncsSorted = config.asmFuncs.sort((a, b) => {
			if (a.length < b.length) return 1;
			if (a.length > b.length) return -1;
			return 0;
		});

		let keywordsSorted = config.keywords.sort((a, b) => {
			if (a.length < b.length) return 1;
			if (a.length > b.length) return -1;
			return 0;
		});

		let segmentsNamesSorted = config.segmentsNames.sort((a, b) => {
			if (a.length < b.length) return 1;
			if (a.length > b.length) return -1;
			return 0;
		});

		let commandMask = `(${commandSorted.join("|")})`;
		let registerMask = `\\W(${config.register.join("|")})`;
		let macroMask = `(${macroSorted.join("|")})`;
		let asmFuncsMask = `(${asmFuncsSorted.join("|")})`;
		let keywordsMask = `(${keywordsSorted.join("|")})`;
		let segmentsMask = `${config.lang.segmentDeclarationPrefix}(${segmentsNamesSorted.join("|")})`;

		return {
			digit: /[\s\(]((0x)[\dA-F]+|(0[db])?-?\d+)/g,
			command: new RegExp(commandMask, "g"),
			register: new RegExp(registerMask, "g"),
			macro: new RegExp(macroMask, "g"),
			asm_funcs: new RegExp(asmFuncsMask, "g"),
			keywords: new RegExp(keywordsMask, "g"),
			segments: new RegExp(segmentsMask, "g"),
			text: /&lt.*?&gt/g,
			char: /\'[\x00-\x7F]\'/g,
			bool: /(true|false)/g,
			mark: /(\w+)\:/g,
			comment: /\/\/[^\n]*\n/g,
			tab: /[^\:0-9]\t/g,
		};
	};

	createReplacers (masks) {
		let res = {};
		for (let i in masks) res[i] = replacer(`h_${i}`);
		return res;
	};

	highlightMarks (text) {
		let marks = Array.from(text.matchAll(this.masks.mark));

		if (marks.length === 0) return text;

		let maskElems = [];
		for (let i of marks) maskElems.push(i[1]);

		let mask = new RegExp(`(${maskElems.join("|")})\:?\\s`, "g");
		return text.replaceAll(mask, this.replacers.mark);	
	};

	highlight (srcText) {
		let resText = srcText.replaceAll("<", "&lt").replaceAll(">", "&gt"); + " ";

		resText = resText.replaceAll(this.masks.command, this.replacers.command);
		resText = resText.replaceAll(this.masks.register, this.replacers.register);
		resText = resText.replaceAll(this.masks.macro, this.replacers.macro);
		resText = resText.replaceAll(this.masks.asm_funcs, this.replacers.asm_funcs);
		resText = resText.replaceAll(this.masks.keywords, this.replacers.keywords);
		resText = resText.replaceAll(this.masks.segments, this.replacers.segments);
		resText = resText.replaceAll(this.masks.text, this.replacers.text);
		resText = resText.replaceAll(this.masks.comment, this.replacers.comment);
		resText = resText.replaceAll(this.masks.char, this.replacers.char);
		resText = resText.replaceAll(this.masks.bool, this.replacers.bool);

		resText = resText.replaceAll(this.masks.tab, match => match[0] + replacer("h_tab", match.slice(1)));
		resText = resText.replaceAll(/^\t/g, this.replacers.tab);
		resText = resText.replaceAll(this.masks.digit, match => match[0] + replacer("h_digit", match.slice(1)));

		return this.highlightMarks(resText);
	};
};

// экспорт
window.Highlighter = Highlighter;

})();