hideLog = false;
(async function () {
	//загрузка файлов
	let extension = "";
	let root = [];
	let counter = 0;

	//загрузить JS
	const addJS = function (path) {
		let e = document.createElement('script');
		e.src = path;
		return e;
	};

	//загрузить CSS
	const addCSS = function (path) {
		let e = document.createElement('link');
		e.rel = "stylesheet";
		e.type = "text/css";
		e.href = path;
		return e;
	};

	//загрузить файл
	const loadFile = function (path, name, ext) {
		ext = ext || extension;
		counter++;
		return new Promise(resolve => {
			let e;
			if (extension === ".css") {
				e = addCSS(path + name + ext);
			} else {
				e = addJS(path + name + ext);
			}
			document.body.appendChild(e);
			e.onerror = () => {throw new Error(`File: ${path + name + ext} not found.`)};
			e.onload = resolve;
		});
	};

	//загрузить массив файлов
	const loadArray = function (files) {
		return new Promise(async function (resolve) {
			let path = root.join("/");
			if (path !== "") path += "/";

			for (let i in files) {
				if (typeof files[i] === "string") {
					await loadFile(path, files[i]);
				} else {
					await loadPack(files[i]);
				}
			}

			resolve();
		});
	};

	//загрузить пакет
	const loadPack = function (pack) {
		return new Promise(async function (resolve) {
			let lastExt = extension;
			
			if (pack.hasOwnProperty("rootDir")) root.push(pack.rootDir);
			if (pack.hasOwnProperty("type")) extension = `.${pack.type}`;
			if (extension === "") throw new Error("Cannot load file without extension.");

			await loadArray(pack.files);

			if (pack.hasOwnProperty("rootDir")) root.pop();
			extension = lastExt;

			resolve();
		});
	};

	//загрузка всех пакетов
	await loadFile("", "structure", ".js");
	counter--;
	(async function () {
		await loadArray(structure);
		
		if (!hideLog) {
			console.log("loading success");
			console.log(counter + " files was loaded");
			if(!delete structure || !delete hideLog) console.warn("Structure object wasn't deleted. Make sure that you declare 'structure' without 'let', 'const' or 'var'.");
		} 

		delete structure;
		delete hideLog;
	}());
}());