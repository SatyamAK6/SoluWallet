exports.getIndex = (req, res, next) => {
    res.render('main', {
        pageTitle: 'Welcome',
        path: '/'
    });
  };