(() => {
    const launchParams = {
        entryFileName: "resources/index.html",
        params: {
            frame: true,
            width: 1920,
            height: 1080,
            icon: "icon.png",
        },
    };

    nw.Window.open(launchParams.entryFileName, launchParams.params, win => {});
})();
