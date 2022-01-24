const { getBalance, internalTransfer } = require('../interface/contract');
const { getAllTxs, getMyTxs} = require('../interface/transaction');
const User = require('../models/user');

exports.getIndex = (req, res, next) => {
    res.render('main', {
        pageTitle: 'Welcome',
        path: '/'
    });
};
  
exports.getHome = async (req, res, next) => {
    if (req.session.user.isAdmin) {
        const txs = await getAllTxs();
        console.log('txs List', JSON.stringify(txs));
        const balance = await getBalance(req.session.user.address);
        res.render('wallet/admin', {
            email: req.session.user.email,
            Address: req.session.user.address,
            Balance: balance,
            Txs:txs,
            pageTitle: 'ADMIN SoluWallet',
            path: '/home'
        });
    } else {
        console.log('HOME', JSON.stringify(req.errorMessage));
        const txs = await getMyTxs(req.session.user.address);
        const balance = await getBalance(req.session.user.address);
        console.log("Balance", balance);
        res.render('wallet/home', {
            email: req.session.user.email,
            Address: req.session.user.address,
            Balance: balance,
            Txs: txs,
            pageTitle: 'Solulab Wallet',
            path: '/home'
        });
    }
}

exports.transferToken = async (req, res, next) => {
    console.log('Transfer Token From', JSON.stringify(req.session.user));
    const fromUser = req.session.user;
    console.log('to Address', req.body.address);
    User.findOne({ address: req.body.address }).then(async (user) => {
        if (!user) {
            res.redirect('/home',{errorMessage:'User is not registered with Solulab Wallet'});
        } else {
            if (!user.isVerified) {
                res.send('User is not Verified yet.');
            } else {
                await internalTransfer(fromUser.address, fromUser.privateKey, fromUser.email, req.body.amount, user.address, user.email);
                res.redirect('/home');
            }
        }
    });
};