const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../Models/User');

exports.signup = (req,res,next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
            .then(() => res.status(201).json({ message: 'User created'}))
            .catch(e => res.status(400).json({e}))

    })
    
    .catch(e => res.status(500).json({e}))

};

exports.login = (req,res,next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Email or password is not correct'})
            } 
                
            bcrypt.compare(req.body.password, user.password)  
                .then(valid => {
                    if (!valid) {
                        // if password or email is
                        return res.status(401).json({ message: 'password is not correct'})
                    }

                    // If password is correct, return user data and token
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id},
                            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
                            { expiresIn: '24h'} // expireS not expire
                        )
                        
                    });
                    
                            
                })
                .catch(error => res.status(500).json({error}))
                
            })
    .catch(error => res.status(500).json({error}))
};

