const Scheme = require("./scheme");
const Part = require("./parts/part");
const VPart = require("./parts/vPart");
const ClockGenerator = require("./parts/clockGenerator");
const ControlUnit = require("./parts/controlUnit");
const Decoder = require("./parts/decoder");
const DLatch = require("./parts/dLatch");
const DLatchPort = require("./parts/dLatchPort");
const DMUX = require("./parts/dmux");
const DMUXPort = require("./parts/dmuxPort");
const DTrigger = require("./parts/dTrigger");
const DTriggerPort = require("./parts/dTriggerPort");
const MUX = require("./parts/mux");
const MUXPort = require("./parts/muxPort");
const Port = require("./parts/port");
const PrimarySum = require("./parts/primarySum");
const RAM = require("./parts/ram");
const RegisterFile = require("./parts/registerFile");
const Sum = require("./parts/sum");
const SwitchPort = require("./parts/switchPort");
const VRAM = require("./parts/vRam"); 

module.exports = {
    Scheme,
    Part,
    VPart,
    ClockGenerator,
    ControlUnit,
    Decoder,
    DLatch,
    DLatchPort,
    DMUX,
    DMUXPort,
    DTrigger,
    DTriggerPort,
    MUX,
    MUXPort,
    Port,
    PrimarySum,
    RAM,
    RegisterFile,
    Sum,
    SwitchPort,
    VRAM,
};