const Part = require("./part");
const Port = require("./port");

class Decoder extends Part {
    constructor (scheme, channelsCount) {
        super(scheme);

        this._channelsCount = channelsCount;
        this._selectSize = Math.ceil(Math.log2(channelsCount));

        let channelSelect = new Port(scheme, this._selectSize);
        let channelSelectRev = new Port(scheme, this._selectSize, "nor");
        let channels = new Port(scheme, this._channelsCount, "and");

        channelSelect.connect(channelSelectRev);

        for (let i = 0; i < this._channelsCount; i++) {
            for (let j = 0; j < this._selectSize; j++) {
                if ((1 << j) & i) channelSelect.elem(j).connect(channels.elem(i));
                else channelSelectRev.elem(j).connect(channels.elem(i));
            }
        }

        this._channelSelect = channelSelect;
        this._channelSelectRev = channelSelectRev;
        this._channels = channels;
    }

    get selectSize () {
        return this._selectSize;
    }

    get channelsCount () {
        return this._channelsCount;
    }

    get channelSelect () {
        return this._channelSelect;
    } 

    get channels () {
        return this._channels;
    }
}

module.exports = Decoder;