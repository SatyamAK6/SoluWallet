import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const txsSchema = new Schema({
  txHash: {
    type: String,
    required: true
    },
    txIndex: {
        type: Number,
        required:true
    },
    txStatus: {
        type: Boolean,
        required: true
    },
    senderAddress: {
      type: String,
      required: true
    },
    receiverAddress: {
        type: String,
        required: true
    },
    amount: String
});

const Txs = mongoose.model('Txs', txsSchema);

export default Txs;