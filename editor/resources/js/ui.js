(() => {

const title = document.getElementById('title');
const file = new File();
const codeWindow = new CodeWindow();
window.codeWindow = codeWindow;

file.on("change", (path, text) => {
	title.textContent = `${path} - ${config.editorName}`;
	codeWindow.text = text;
});

file.on("saved", (path) => {
	title.textContent = `${path} - ${config.editorName}`;
});

window.addEventListener("keydown", e => {
	if (e.ctrlKey && e.shiftKey && e.code === "KeyC") {
		e.preventDefault();
		compileMenuOpen();
		compileBtn.click();
	}

	if (e.code === "Escape" && isCompileMenuOpen()) {
		e.preventDefault();
		compileMenuClose();
	}

	if (e.ctrlKey || !title.textContent.includes("-") || title.textContent.includes("*")) return;
	title.textContent = title.textContent.replace(" -", "* -");
});

// подключение меню
let menu = new nw.Menu({type: 'menubar'});

let filemenu = new nw.Menu();

filemenu.append(new nw.MenuItem({ 
	label: "New",
	key: "n",
	modifiers: "Ctrl",

	click: () => file.saveAs(codeWindow.text),
}));

filemenu.append(new nw.MenuItem({ 
	label: "Open",
	key: "o",
	modifiers: "Ctrl",

	click: () => {
		if (file.path) file.save(codeWindow.text);
		file.open();
	},
}));

filemenu.append(new nw.MenuItem({ 
	label: "Save",
	key: "s",
	modifiers: "Ctrl",

	click: () => file.save(codeWindow.text),
}));

menu.append(new nw.MenuItem({
	label: "File",
	submenu: filemenu,
}));

menu.append(new nw.MenuItem({
	label: "Compilation",
	click: compileMenuToggle,
}));

nw.Window.get().menu = menu;

window.addEventListener("load", () => {
	document.body.classList.remove("preload");

	let gui = require('nw.gui');
	if (gui.App.argv[0]) {
		file.path = gui.App.argv[0];
		file.load();
	} 

	if (file.text) {
		codeWindow.text = file.text;
		title.textContent = `${file.path} - ${config.editorName}`;
	}
});

compileBtn.addEventListener("click", async function () {
	file.save(codeWindow.text);
	let compileOut = await compile(getAssemblerPath(), file.path, getResultPath());
	setCompileOut(compileOut);
});

})();