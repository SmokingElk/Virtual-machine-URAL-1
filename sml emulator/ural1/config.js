const characteristic = {
	machineWord: 2**3,
	ramCapacity: 2**10,
	isrAddrLocation: 1023,
	clkHalfPeriod: 60,
};

const regFileConfig = {
	registersCount: 16,

	specialPurposeRegs: {
		RF: 0,
		MS: 12,
		AO: 13,
		BO: 14,
		DI: 15,
	},

	RFbits: {
		LT: 0,
		EQ: 1,
		OV: 2,
		INT: 3,
		PA: 4,
		PB: 5,
		GP0: 6,
		GP1: 7,
	},
};

const instructionParts = {
	opCode: [20, 24],
	funct: [17, 20],

	const1: [0, 8],
	const2: [8, 16],

	reg1: [12, 16],
	reg2: [8, 12],
};

const aluModeCodes = {
	AND: 0b000,
	OR: 0b001,
	ADD: 0b010,
	SUB: 0b011,
	SRA: 0b100,
	SRL: 0b101,
	XOR: 0b110,
	NOT: 0b111,
};

const compareModeCodes = {
	NE: 0b000,
	LT: 0b001,
	LE: 0b010,
	MT: 0b011,
	ME: 0b100,
	OV: 0b101,
	NOV: 0b110,
	EQ: 0b111,
};

const CUTruthTable = [
	[ "WriteReg", "UseC", "WriteRAM", "SaveC", "RAddr", "Load", "RAS", "ALURes", "ALUFlags", "Branch", "BranchC", "SaveRA", "RAT" ],
	[ "1", "0", "0", "X", "X", "0", "X", "0", "X", "0", "0", "0", "X" ],
	[ "1", "1", "0", "X", "X", "0", "X", "0", "X", "0", "0", "0", "X" ],
	[ "0", "0", "1", "0", "0", "X", "X", "X", "X", "0", "0", "0", "X" ],
	[ "0", "0", "1", "1", "0", "X", "X", "X", "X", "0", "0", "0", "X" ],
	[ "0", "0", "1", "0", "1", "X", "0", "X", "X", "0", "0", "0", "X" ],
	[ "1", "X", "0", "X", "0", "1", "X", "0", "X", "0", "0", "0", "X" ],
	[ "1", "X", "0", "X", "1", "1", "1", "0", "X", "0", "0", "0", "X" ],
	[ "1", "0", "0", "X", "X", "0", "X", "1", "0", "0", "0", "0", "X" ],
	[ "1", "1", "0", "X", "X", "0", "X", "1", "0", "0", "0", "0", "X" ],
	[ "1", "0", "0", "X", "X", "0", "X", "1", "1", "0", "0", "0", "X" ],
	[ "1", "1", "0", "X", "X", "0", "X", "1", "1", "0", "0", "0", "X" ],
	[ "0", "1", "0", "0", "X", "X", "X", "0", "X", "1", "0", "0", "0" ],
	[ "0", "0", "0", "0", "X", "X", "X", "0", "X", "1", "0", "0", "0" ],
	[ "0", "1", "0", "0", "X", "X", "X", "0", "X", "0", "1", "0", "0" ],
	[ "0", "1", "0", "0", "X", "X", "X", "0", "X", "1", "0", "1", "0" ],
	[ "0", "X", "0", "X", "X", "X", "X", "X", "X", "1", "0", "0", "1" ],
];

module.exports = {
	characteristic,
	regFileConfig,
	instructionParts,
	aluModeCodes,
	compareModeCodes,
	CUTruthTable,
};