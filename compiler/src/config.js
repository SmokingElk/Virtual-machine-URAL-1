const config = {
	syntax: {
		comment: "//",
		preprosDirectivePrefix: "#",
		newLineMacroSymbol: "\\",
		includeDirective: "include",
		librariesPath: "D:/JS/random_js_project/logic/URAL-1/compiler/libraries",

		segmentDeclarationPrefix: ".",
		segmentsNames: {
			code: "code",
			data: "data",
		},

		nameValidator: /\w+/,
		unitializedDataSymbol: "?", 

		procedureKeyword: "proc",
		labelNameSep: ":",
		argSep: " ",
		entryPointName: "main",
		isrName: "_ISR",
		refFuncName: "ref",
		ipFuncName:	"IP",

		instructionsNames: {
			int: "int",
			noI: "noI",
			jump: "jump",
			beq: "beq",
			bne: "bne",
			blt: "blt",
			ble: "ble",
			bmt: "bmt",
			bme: "bme",
			bov: "bov",
			bno: "bno",
			call: "call",
			ret: "ret",
			retI: "retI",
		},
	},

	autoInclude: [
		"stdlib.ur1",
	],

	commands: {
		"move": {
			reg1: 0,
			reg2: 1,
			argsCount: 2,
		},

		"write": {
			reg1: 0,
			const1: 1,
			argsCount: 2,
		},

		"saveR": {
			reg2: 1,
			dataAddr: 0,
			argsCount: 2,
		},

		"saveC": {
			const2: 1,
			dataAddr: 0,
			argsCount: 2,
		},

		"svPR": {
			reg1: 0,
			reg2: 1,
			argsCount: 2,
		},

		"load": {
			reg1: 0,
			dataAddr: 1,
			argsCount: 2,
		},

		"loadP": {
			reg1: 0,
			reg2: 1,
			argsCount: 2,
		},

		"andR": {
			opCode: "aluR",
			reg1: 0,
			reg2: 1,
			argsCount: 2,
			ALU: "AND",
		},

		"orR": {
			opCode: "aluR",
			reg1: 0,
			reg2: 1,
			argsCount: 2,
			ALU: "OR",
		},

		"xorR": {
			opCode: "aluR",
			reg1: 0,
			reg2: 1,
			argsCount: 2,
			ALU: "XOR",
		},

		"addR": {
			opCode: "aluR",
			reg1: 0,
			reg2: 1,
			argsCount: 2,
			ALU: "ADD",
		},

		"subR": {
			opCode: "aluR",
			reg1: 0,
			reg2: 1,
			argsCount: 2,
			ALU: "SUB",
		},

		"andC": {
			opCode: "aluC",
			reg1: 0,
			const1: 1,
			argsCount: 2,
			ALU: "AND",
		},

		"orC": {
			opCode: "aluC",
			reg1: 0,
			const1: 1,
			argsCount: 2,
			ALU: "OR",
		},

		"xorC": {
			opCode: "aluC",
			reg1: 0,
			const1: 1,
			argsCount: 2,
			ALU: "XOR",
		},

		"addC": {
			opCode: "aluC",
			reg1: 0,
			const1: 1,
			argsCount: 2,
			ALU: "ADD",
		},

		"subC": {
			opCode: "aluC",
			reg1: 0,
			const1: 1,
			argsCount: 2,
			ALU: "SUB",
		},

		"incr": {
			opCode: "aluC",
			reg1: 0,
			const1: "00000001",
			argsCount: 1,
			ALU: "ADD",
		},

		"decr": {
			opCode: "aluC",
			reg1: 0,
			const1: "00000001",
			argsCount: 1,
			ALU: "SUB",
		},

		"not": {
			opCode: "aluC",
			reg1: 0,
			argsCount: 1,
			ALU: "NOT",
		},

		"shl": {
			opCode: "aluR",
			reg1: 0,
			reg2: 0,
			argsCount: 1,
			ALU: "ADD",
		},

		"shr": {
			opCode: "aluC",
			reg1: 0,
			argsCount: 1,
			ALU: "SRL",
		},

		"shrA": {
			opCode: "aluC",
			reg1: 0,
			argsCount: 1,
			ALU: "SRA",
		},

		"mod2": {
			opCode: "aluC",
			reg1: 0,
			const1: "00000001",
			argsCount: 1,
			ALU: "AND",
		},

		"mod4": {
			opCode: "aluC",
			reg1: 0,
			const1: "00000011",
			argsCount: 1,
			ALU: "AND",
		},

		"mod8": {
			opCode: "aluC",
			reg1: 0,
			const1: "00000111",
			argsCount: 1,
			ALU: "AND",
		},

		"mod16": {
			opCode: "aluC",
			reg1: 0,
			const1: "00001111",
			argsCount: 1,
			ALU: "AND",
		},

		"cmpR": {
			reg1: 0,
			reg2: 1,
			argsCount: 2,
		},

		"cmpC": {
			reg1: 0,
			const1: 1,
			argsCount: 2,
		},

		"jump": {
			label: 0,
			argsCount: 1,
		},

		"jumpP": {
			reg2: 0,
			argsCount: 1,
		},

		"beq": {
			opCode: "bcon",
			label: 0,
			argsCount: 1,
			cmpMode: "EQ",
		},

		"bne": {
			opCode: "bcon",
			label: 0,
			argsCount: 1,
			cmpMode: "NEQ",
		},

		"blt": {
			opCode: "bcon",
			label: 0,
			argsCount: 1,
			cmpMode: "LT",
		},

		"ble": {
			opCode: "bcon",
			label: 0,
			argsCount: 1,
			cmpMode: "LTE",
		},

		"bmt": {
			opCode: "bcon",
			label: 0,
			argsCount: 1,
			cmpMode: "MT",
		},

		"bme": {
			opCode: "bcon",
			label: 0,
			argsCount: 1,
			cmpMode: "MTE",
		},

		"bov": {
			opCode: "bcon",
			label: 0,
			argsCount: 1,
			cmpMode: "OV",
		},

		"bno": {
			opCode: "bcon",
			label: 0,
			argsCount: 1,
			cmpMode: "NOV",
		},

		"call": {
			label: 0,
			argsCount: 1,
		},

		"ret": {
			funct: "000",	
		},

		"retI": {
			opCode: "ret",
			funct: "100",
		},

		"onA": {
			opCode: "aluC",
			reg1: "RS",
			const1: "00010000",
			ALU: "OR",
		},

		"offA": {
			opCode: "aluC",
			reg1: "RS",
			const1: "11101111",
			ALU: "AND",
		},

		"onB": {
			opCode: "aluC",
			reg1: "RS",
			const1: "00100000",
			ALU: "OR",
		},

		"offB": {
			opCode: "aluC",
			reg1: "RS",
			const1: "11011111",
			ALU: "AND",
		},

		"int": {
			opCode: "aluC",
			reg1: "RS",
			const1: "00001000",
			ALU: "OR",
		},

		"noI": {
			opCode: "aluC",
			reg1: "RS",
			const1: "11110111",
			ALU: "AND",
		},

		"msSR": {
			opCode: "move",
			reg1: "MS",
			reg2: 0,
			argsCount: 1,
		},

		"msSC": {
			opCode: "write",
			reg1: "MS",
			const1: 0,
			argsCount: 1,
		},

		"noop": {
			opCode: "move",
			reg1: "AX",
			reg2: "AX",
		},
	},

	procedureKeepingInstructions: [
		"jump", "beq", "bne", "blt", "ble", "bmt", "bme", "bov", "bno", "call"
	],
	
	servicePartText: `write SP $staticUsed	
msSC $dataSegAddr	
$intPermission
jump $entryName`,

	defaultIsr: `proc $isrName:
retI`,

	types: {
		byte: {
			validator: "[01]{$word}", 
			defaultValue: 0,
			parse: image => Number.parseInt(image, 2),
		},

		char: {
			validator: "'[\x00-\x7F]'",
			defaultValue: 0,
			parse: image => image.charCodeAt(1),
		},

		bool: {
			validator: "(true|false)",
			defaultValue: 0,
			parse: image => image === "true" ? 0b11111111 : 0b00000000,
		},
	},

	hardware: {
		machineWord: 8,
		dataCapacity: 256,
		instructionsCapacity: 256,
		instructionSize: 3,

		segmentsNums: {
			code1: 0,
			code2: 1,
			code3: 2,
			data: 3,
		},

		register: {
			RS    : "0000",
	
			AX    : "0001",
			BX    : "0010",
			CX    : "0011",
			DX    : "0100",
			EX    : "0101",
			FX    : "0110",
			GX    : "0111",
			HX    : "1000",
			IX    : "1001",
			JX    : "1010",
			KX    : "1011",
			LX    : "1100",
			MX    : "1101",
			NX    : "1110",
			OX    : "1111",
	
			SP    : "1000",
			AP    : "1001",
			BP    : "1010",
			CP    : "1011",
			RV    : "1011",
			MS    : "1100",
			
			AO    : "1101",
			BO    : "1110",
			DI    : "1111",
		},
	
		opCodes: {
			move  : "0000",
			write : "0001",
			saveR : "0010",
			saveC : "0011",
			svPR  : "0100",
			load  : "0101",
			loadP : "0110",
			aluR  : "0111",
			aluC  : "1000",
			cmpR  : "1001",
			cmpC  : "1010",
			jump  : "1011",
			jumpP : "1100",
			bcon  : "1101",
			call  : "1110",
			ret   : "1111",
		},
	
		ALU: {
			AND   : "000",
			OR    : "001",
			ADD   : "010",
			SUB   : "011",
			NOT   : "111",
			SRA   : "100",
			SRL   : "101",
			XOR   : "110",
		},
	
		CMP: {
			NEQ   : "000",
			LT    : "001",
			LTE   : "010",
			MT    : "011",
			MTE   : "100",
			EQ    : "111",
			OV    : "101",
			NOV   : "110",
		},
	},
};

module.exports = config;