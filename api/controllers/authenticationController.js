const User = require('../models/Users')
const jwt = require('jwt-simple')
const config = require('../config')

const tokenForUser = user => {
    const timestamp =  new Date().getTime()
    return jwt.encode({
        sub: user.id,
        iat: timestamp
    }, config.secret)
}

exports.signin = (req, res, next) => {
    const user = req.user
    res.send({token : tokenForUser(user), user_id: user._id})
}

exports.signup = async (req, res, next) => {
    const {
        email,
        password
    } = req.body
    if(!email || !password) {
        return res.status(422).json({
            error: 'Please provide your email and password'
        })
    }

    try {
        const existingUser = await User.findOne({ email: email })
        if (existingUser) {
            return res.status(422).json({
                error: 'Email is already in use'
            })
        }

        const user = new User({ email, password })
        await user.save()
        res.json({
            user_id: user._id,
            token: tokenForUser(user)
        })
    } catch(err) {
        next(err)
    }

     // User.findOne({ email: email }, (err, existingUser) => {
    //     if(err){ return next(err) }
    //     if(existingUser){  return res.status(422).json({
    //         error: 'Email is already in use'
    //     })}

    //     const user = new User({
    //         email: email,
    //         password: password
    //     })
    //     user.save((err) => {
    //         if(err){ return next(err) }
    //         res.json({ 
    //             user_id: user._id,
    //             token: tokenForUser(user)
    //         })
    //     })
    // })

    // "MongooseError: Model.findOne() no longer accepts a callback"
}