const Txs = require('../models/txs');

exports.getAllTxs = () => {
    const txs = Txs.find().then(txs => {
        if (!txs) {
            return [];
        }
        return txs;
    });
    return txs;
};

exports.getMyTxs = (_address) => {
    const txs = Txs.find({ $or: [{ 'senderAddress': _address }, { 'receiverAddress': _address }] }).then(txs => { 
        if (!txs) {
            return [];
        }
        return txs;
    });
    return txs;
}