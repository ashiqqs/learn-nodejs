const jwt = require('jsonwebtoken');

const authGuard = (req, res, next) => {
    const {authorization} = req.headers;
    try{
        const token = authorization.split(' ')[1];
        const payload = jwt.verify(token, process.env.JWT_KEY);
        const {userId, userName} = payload;
        req.userName = userName;
        req.userId = userId;
        next();
    }
    catch(err){
        // next({
        //     status: 401,
        //     message: 'Unauthorized'
        // });
        res.status(401).send({message: 'You are not authorized to access this resource'});
    }
};

module.exports = authGuard;