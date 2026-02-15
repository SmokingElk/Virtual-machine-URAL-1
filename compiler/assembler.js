const fs = require("fs");
const path = require("path");
const compile = require("./src/compile");
const makeInfoMessage = require("./src/makeInfoMessage");

console.log(`
	URAL-1
___ASSEMBLER___\x1b[31m

    @ @ @ @     
  @   #     @   
@   # # #     @
  # # #       @ 
    #   #     @ 
          #   @
    @ @     @  
@ @     @ @   # \x1b[37m  
`);

const srcPath = process.argv[2];
const savePath = process.argv[3];
const showExtendedInfo = process.argv[4];

if (srcPath === "help") {
	console.log("\n\x1b[33m=== H E L P ===\x1b[37m\n");
	console.log("You need to point out a path to source file and an exit file name.");
	console.log("You can find the result in a folder '.\\result'\n");
	console.log("Example:\n\x1b[33mnode index.js \x1b[36mC:\\src.ur1 \x1b[35mexit_file_name\x1b[37m\n");
	console.log("If you got a kind of path error, try to remove whitespaces from yout path.\n\n");
} else {
	let srcCode = fs.readFileSync(srcPath, {encoding: "utf-8"});

	try {
		let [machineCode, info] = compile(srcCode);
		let saveName = srcPath.split(/(\\|\/)/g).slice(-1)[0].split(".")[0];
		fs.writeFileSync(`${savePath}/${saveName}.ur1mc`, machineCode);
		
		console.log(makeInfoMessage(info, showExtendedInfo === "-g"));
	} catch (err) {
		process.stderr.write(err.message);
		process.exit(1);
	}
}

