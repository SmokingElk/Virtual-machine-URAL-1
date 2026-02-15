(() => {

const fs = require("fs");
const path = require("path");

class File extends EventManager {
	constructor () {
		super();

		this._path = localStorage.getItem("last_file");
		this.text = "";

		this.load();
	};

	set path (value) {
		this._path = value;
		localStorage.setItem("last_file", value);
	};

	get path () {
		return this._path;
	};

	load () {
		if (!this.path) return;
		try {
			this.text = fs.readFileSync(this.path, { encoding: "utf-8" });
		} catch (err) {
			this.path = "";
		}
	};

	open () {
		let openField = document.createElement("input");
		openField.setAttribute("type", "file");
		openField.setAttribute("accept", ".ur1");

		openField.addEventListener("change", e => {
			let file = e.target.files[0];
			let fileReader = new FileReader();

			this.path = file.path;

			fileReader.readAsText(file);

			fileReader.addEventListener("load", readerEvent => {
				this.text = readerEvent.target.result; 
				this._emit("change", this.path, this.text);
			});
		});

		openField.click();
	};

	save (text = "") {
		if (!this.path) return this.saveAs();

		this.text = text;

		fs.writeFileSync(this.path, this.text, { encoding: "utf-8" });
		this._emit("saved", this.path);
	};

	saveAs () {
		let saveField = document.createElement("input");
		saveField.setAttribute("type", "file");
		saveField.setAttribute("accept", ".ur1");
		saveField.setAttribute("nwsaveas", "programm.ur1");

		saveField.addEventListener("change", e => {
			this.path = e.target.value;
			this.text = "";
			this._emit("change", this.path, this.text);
			this.save(this.text);
		});

		saveField.click();
	};
};

// экспорт
window.File = File;

})();