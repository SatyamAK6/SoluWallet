import { getBalance, internalTransfer } from '../interface/contract';
import { getAllTxs, getMyTxs} from '../interface/transaction';
import User from '../models/user';

export const getIndex = (req, res, next) => {
    res.render('main', {
        pageTitle: 'Welcome',
        path: '/'
    });
};
  
export const getTxs = async (req, res, next) => {
    console.log('GET TX',req.user);
    if (req.user.access) {
        const txs = await getAllTxs();
        return res.send(txs);
    } else {
        const txs = await getMyTxs(req.user.address);
        return res.send(txs);
    }
}

export const getBalances = async (req, res, next) => {
    console.log('GET BALANCE', JSON.stringify(req.user));
    const Balance = await getBalance(req.user.address);
    return res.send({ Address: req.user.address, Balance: Balance });
}

export const transferToken = async (req, res, next) => {
    const fromUser = req.user;
    console.log('send to', req.body.address);
    console.log('send to Amount', req.body.amount);
    User.findOne({ address: req.body.address }).then(async (user) => {
        if (!user) {
            return res.send('User is not registered with Solulab Wallet');
        } else {
            if (!user.isVerified) {
                return res.send('User is not Verified yet.');
            } else {
                const txReceipt = await internalTransfer(fromUser.address, fromUser.pk, fromUser.email, req.body.amount, user.address, user.email);
                return res.send(txReceipt);
            }
        }
    });
};