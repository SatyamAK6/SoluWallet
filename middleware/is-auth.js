const isAuth = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(403);
    console.log('Token from req', token);
    console.log('req.session.token', req.session.token);
    if (token == req.session.token) {
        console.log('token Verified');
        next();
    } else {
        return res.send('Token Expired');
    }
}

export default isAuth;