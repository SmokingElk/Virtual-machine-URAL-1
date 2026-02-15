const { Part, RegisterFile, VRAM, ControlUnit, ClockGenerator, Port, DTriggerPort, Sum, MUXPort, MUX, DTrigger } = require("../sml/sml");
const ALU = require("./alu");
const ComparatorsBlock = require("./comparatorsBlock");
const { characteristic, CUTruthTable, regFileConfig, instructionParts } = require("./config");

class URAL1 extends Part {
    constructor (scheme) {
        super(scheme);

        // тактовый генератор
        let clockGenerator = new ClockGenerator(scheme, characteristic.clkHalfPeriod);
        let clkDelay1 = this.add("or");
        let clkDelay2 = this.add("timer", 1);
        clockGenerator.clk.connect(clkDelay1);
        clockGenerator.clk.connect(clkDelay2);
        this._clk = clockGenerator.clk;
        this._clkPeriod = clockGenerator.period;

        // включение
        this._active = this.add("switch");
        this._active.connect(clockGenerator.active);
        
        // регистровый файл
        let registerFile = new RegisterFile(scheme, {
            registersCount: regFileConfig.registersCount,
            registerSize: characteristic.machineWord,
            readChannelsCount: 2,
            writeAlways: [ regFileConfig.specialPurposeRegs.DI ],
        });

        this._registerFile = registerFile;

        this.clk.connect(registerFile.clk);

        this._DI = registerFile.register(regFileConfig.specialPurposeRegs.DI).input;

        this._AO = new Port(scheme, characteristic.machineWord, "and");
        this._BO = new Port(scheme, characteristic.machineWord, "and");

        registerFile.register(regFileConfig.specialPurposeRegs.AO).output.connect(this._AO);
        registerFile.register(regFileConfig.specialPurposeRegs.BO).output.connect(this._BO);
        registerFile.register(regFileConfig.specialPurposeRegs.RF).output.elem(regFileConfig.RFbits.PA).connect(this._AO);
        registerFile.register(regFileConfig.specialPurposeRegs.RF).output.elem(regFileConfig.RFbits.PB).connect(this._BO);

        // оперативная память
        let ram = new VRAM(scheme, {
            capacity: characteristic.ramCapacity,
            cellSize: characteristic.machineWord,
            needAccess: [ characteristic.isrAddrLocation ],
            readChannels: [ { width: 1 }, { width: 3 } ],
        });

        this._ram = ram;
        this.clk.connect(ram.clk);

        // регистры специального назначения
        // указатель инструкции
        this._IP = new DTriggerPort(scheme, characteristic.machineWord);
        clkDelay2.connect(this.IP.clk);
        this.IP.output.connect(ram.readSelect(1));

        let ipIncr = new Sum(scheme, this.IP.size);
        let ipAdd1 = this.add("switch", true);
        ipAdd1.connect(ipIncr.inputCarryOver);
        this.IP.output.connect(ipIncr.inputA);

        // адрес возврата подпрограммы
        this._RA = new DTriggerPort(scheme, characteristic.machineWord);
        let writeRA = this.add("and");
        writeRA.connect(this.RA.clk);
        clkDelay1.connect(writeRA);

        // адрес возврата из процедуры обработчика прерывания
        this._IRA = new DTriggerPort(scheme, characteristic.machineWord);
        let writeIRA = this.add("and");
        writeIRA.connect(this.IRA.clk);
        clkDelay1.connect(writeIRA);

        // служебные части тракта данных, мультиплексоры
        let useISRMUX = new MUXPort(scheme, 2, characteristic.machineWord);

        let retSelectMUX = new MUXPort(scheme, 2, characteristic.machineWord);
        let retSelectActive = this.add("and");
        retSelectMUX.inputSelect.addSource(retSelectActive);

        let needRetMUX = new MUXPort(scheme, 2, characteristic.machineWord);

        let loadMUX = new MUXPort(scheme, 2, characteristic.machineWord);
        let saveCMUX = new MUXPort(scheme, 2, characteristic.machineWord);

        let needBranchMUX = new MUXPort(scheme, 2, characteristic.machineWord);
        let branchActive = this.add("or");
        let conditionalBranchActive = this.add("and");
        needBranchMUX.inputSelect.addSource(branchActive);
        conditionalBranchActive.connect(branchActive);

        let useCMUX = new MUXPort(scheme, 2, characteristic.machineWord);
        let rasMUX = new MUXPort(scheme, 2, characteristic.machineWord);
        let rAddrMUX = new MUXPort(scheme, 2, characteristic.machineWord); 
        let aluFlagsMUX = new MUXPort(scheme, 2, characteristic.machineWord);  
        let aluResMUX = new MUXPort(scheme, 2, characteristic.machineWord); 
        
        let useWriteToRF = this.add("nor");
        let writeSwitchablePort = new Port(scheme, registerFile.selectSize, "and");
        writeSwitchablePort.addSource(useWriteToRF);

        // устройство управления
        let cu = new ControlUnit(scheme, CUTruthTable);

        writeRA.addSource(cu.SaveRA);
        retSelectActive.addSource(cu.RAT);
        needRetMUX.inputSelect.addSource(cu.RAT);
        loadMUX.inputSelect.addSource(cu.Load);
        ram.allowWrite.addSource(cu.WriteRAM);
        registerFile.allowWrite.addSource(cu.WriteReg);
        saveCMUX.inputSelect.addSource(cu.SaveC);
        branchActive.addSource(cu.Branch);
        useCMUX.inputSelect.addSource(cu.UseC);
        rasMUX.inputSelect.addSource(cu.RAS);
        rAddrMUX.inputSelect.addSource(cu.RAddr);
        conditionalBranchActive.addSource(cu.BranchC);
        aluFlagsMUX.inputSelect.addSource(cu.ALUFlags);
        useWriteToRF.addSource(cu.ALUFlags);
        aluResMUX.inputSelect.addSource(cu.ALURes);

        // АЛУ
        let alu = new ALU(scheme);

        let joinBits = new Port(scheme, characteristic.machineWord);
        alu.lessOutput.connect(joinBits.elem(regFileConfig.RFbits.LT));
        alu.equalOutput.connect(joinBits.elem(regFileConfig.RFbits.EQ));
        alu.overflowOutput.connect(joinBits.elem(regFileConfig.RFbits.OV));
        registerFile.register(regFileConfig.specialPurposeRegs.RF).output
            .slice(regFileConfig.RFbits.INT, regFileConfig.RFbits.GP1 + 1).connect(joinBits, regFileConfig.RFbits.INT);

        joinBits.connect(aluFlagsMUX.input(1));

        // блок компараторов
        let comparatorsBlock = new ComparatorsBlock(scheme);
        
        // источник прерывания
        this._externalInt = this.add("or");

        let intBefore = new DTrigger(scheme);
        this.externalInt.connect(intBefore.input);
        clkDelay2.connect(intBefore.clk);
        
        let reverseIntBefore = this.add("nor");
        intBefore.output.connect(reverseIntBefore);

        let activeInt = this.add("and");
        this.externalInt.connect(activeInt);
        reverseIntBefore.connect(activeInt);
        registerFile.register(regFileConfig.specialPurposeRegs.RF).output.elem(regFileConfig.RFbits.INT).connect(activeInt);
        activeInt.connect(writeIRA);
        useISRMUX.inputSelect.addSource(activeInt);

        // формирование полного адреса
        let signExtend = new Port(scheme, ram.writeSelectSize);
        registerFile.register(regFileConfig.specialPurposeRegs.MS).output.connect(signExtend, characteristic.machineWord);
        signExtend.connect(ram.readSelect(0));
        signExtend.connect(ram.writeSelect);

        // подключение компонентов тракта данных
        // подключение мультиплексоров
        needBranchMUX.output.connect(useISRMUX.input(0));
        needBranchMUX.output.connect(this.IRA.input);
        ram.rightAccess(characteristic.isrAddrLocation).connect(useISRMUX.input(1));
        useISRMUX.output.connect(this.IP.input);

        this.RA.output.connect(retSelectMUX.input(0));
        this.IRA.output.connect(retSelectMUX.input(1));
        retSelectMUX.output.connect(needRetMUX.input(1));

        saveCMUX.output.connect(needRetMUX.input(0));
        needRetMUX.output.connect(needBranchMUX.input(1));

        aluResMUX.output.connect(saveCMUX.input(0));
        saveCMUX.output.connect(ram.write);

        aluResMUX.output.connect(loadMUX.input(0));
        loadMUX.output.connect(registerFile.write);

        writeSwitchablePort.connect(registerFile.writeSelect);

        useCMUX.output.connect(alu.inputB);
        useCMUX.output.connect(aluResMUX.input(0));

        rasMUX.output.connect(rAddrMUX.input(1));
        rAddrMUX.output.connect(signExtend);

        aluFlagsMUX.output.connect(aluResMUX.input(1));

        // подключение RAM
        ram.read(0).connect(loadMUX.input(1));

        // подключение частей инструкции
        ram.read(1).slice(...instructionParts.opCode).connect(cu.opCodeInput);
        ram.read(1).slice(...instructionParts.funct).connect(alu.modeSelect);
        ram.read(1).slice(...instructionParts.funct).connect(comparatorsBlock.modeSelect);
        ram.read(1).elem(instructionParts.funct[1] - 1).connect(retSelectActive);

        ram.read(1).slice(...instructionParts.reg1).connect(registerFile.readSelect(0));
        ram.read(1).slice(...instructionParts.reg1).connect(writeSwitchablePort);
        ram.read(1).slice(...instructionParts.reg2).connect(registerFile.readSelect(1));
        
        ram.read(1).slice(...instructionParts.const1).connect(rAddrMUX.input(0));
        ram.read(1).slice(...instructionParts.const1).connect(useCMUX.input(1));
        ram.read(1).slice(...instructionParts.const2).connect(saveCMUX.input(1));

        // подключение регистрового файла
        registerFile.read(0).connect(alu.inputA);
        registerFile.read(0).connect(rasMUX.input(0));
        registerFile.read(1).connect(rasMUX.input(1));
        registerFile.read(0).elem(0).connect(comparatorsBlock.lessInput);
        registerFile.read(0).elem(1).connect(comparatorsBlock.equalInput);
        registerFile.read(0).elem(2).connect(comparatorsBlock.overflowInput);

        registerFile.read(1).connect(useCMUX.input(0));

        // подключение АЛУ
        alu.output.connect(aluFlagsMUX.input(0));

        // подключение блока компараторов
        comparatorsBlock.output.connect(conditionalBranchActive);

        // подключение инкремента указателя инструкции
        ipIncr.output.connect(needBranchMUX.input(0));
        ipIncr.output.connect(this.RA.input);

        this._aluResMUX = aluResMUX;
        this._alu = alu;
        this._writeSwitchablePort = writeSwitchablePort;
    }

    get externalInt () {
        return this._externalInt;
    }

    get DI () {
        return this._DI;
    }

    get AO () {
        return this._AO;
    }

    get BO () {
        return this._BO;
    }

    get IP () {
        return this._IP;
    }

    get RA () {
        return this._RA;
    }

    get IRA () {
        return this._IRA;
    }

    get active () {
        return this._active;
    }

    get clkPeriod () {
        return this._clkPeriod;
    }

    get clk () {
        return this._clk;
    }

    flash (data) {
        this._ram.flash(data);
    }
}

module.exports = URAL1;