const { ethers } = require("ethers");

exports.getIndex = (req, res, next) => {
    res.render('main', {
        pageTitle: 'Welcome',
        path: '/'
    });
};
  
exports.getHome = (req, res, next) => {
    console.log('HOME', JSON.stringify(req.session.user.mnemonics));
    const wallet = ethers.Wallet.fromMnemonic(req.session.user.mnemonics);
    res.render('wallet/home', {
        email: req.session.user.email,
        Address: wallet.address,
        pageTitle: 'Solulab Wallet',
        path: '/home'
    });
}