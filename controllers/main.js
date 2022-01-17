const {getBalance, initialTransfer } = require('../interface/contract');


exports.getIndex = (req, res, next) => {
    res.render('main', {
        pageTitle: 'Welcome',
        path: '/'
    });
};
  
exports.getHome = async (req, res, next) => {
    console.log('HOME', JSON.stringify(req.session.user));
    const balance = await getBalance(req.session.user.address);
    console.log("Balance", balance);
    res.render('wallet/home', {
        email: req.session.user.email,
        Address: req.session.user.address,
        Balance : balance,
        pageTitle: 'Solulab Wallet',
        path: '/home'
    });
}