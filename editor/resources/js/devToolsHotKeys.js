window.addEventListener("keydown", event => {
	switch (event.code) {
		case "KeyI":
			if (event.shiftKey && event.ctrlKey) nw.Window.get().showDevTools();
			break;

		case "KeyR":
			if (event.ctrlKey) {
				nw.Window.get().reload();
				interface.saveFile();
			} 
			break;
	}
});