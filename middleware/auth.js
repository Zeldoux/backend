const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
    console.log('Auth middleware called');
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next(); // missing next() to call next middleware
    } catch(e) {
        res.status(401).json({e})
    }
}