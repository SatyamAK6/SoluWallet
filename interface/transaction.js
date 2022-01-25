import Txs from '../models/txs';

export const getAllTxs = () => {
    const txs = Txs.find().then(txs => {
        if (!txs) {
            return [];
        }
        return txs;
    });
    return txs;
};

export const getMyTxs = (_address) => {
    const txs = Txs.find({ $or: [{ 'senderAddress': _address }, { 'receiverAddress': _address }] }).then(txs => { 
        if (!txs) {
            return [];
        }
        return txs;
    });
    return txs;
}

// export default { getAllTxs, getMyTxs };