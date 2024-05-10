const passport = require('passport')
const Extractjwt = require('passport-jwt').ExtractJwt
const JwtStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local').Strategy

const User = require('../models/Users')
const config = require('../config')

const localOptions = {
    usernameField: 'email'
}

const localStrategy = new LocalStrategy(localOptions, async function(email, password, done){
    try {
        const user = await User.findOne({ email: email })
        if(!user){ return done(null, false) }
        const isMatch = await user.comparePassword(password)
        if(!isMatch){ return done(null, false) } 
        return done(null, user)
    } catch (err) {
        return done(err)
    }
})


// const localStrategy = new LocalStrategy(localOptions, function(email, password, done){
//     User.findOne({email: email}, function(err, user){
//         if(err){ return done(err)}
//         if(!user) {return done(null, false)}
//         user.comparePassword(password, function(err, isMatch){
//             if(err) { return done(err) }
//             if(!isMatch) { return  done(null, false) }
//             return  done(null, user)
//         })
//     })
// })


const jwtOptions = {
    secretOrKey: config.secret,
    jwtFromRequest: Extractjwt.fromHeader('authorization')
}

const jwtStrategy = new JwtStrategy(jwtOptions, async function(payload, done){
    try {
        const user = await User.findById(payload.sub)
        if (user) {
            done(null, user)
        } else {
            done(null, false)
        }
    } catch(err) {
        done(err, false)
    }
})
// MongooseError: Model.findById() no longer accepts a callback
// const newJwtStrategy = new JwtStrategy(jwtOptions, function(payload, done){
//     User.findById(payload.sub, function(err, user){
//         if(err) { return done(err, false) }
        
//         if(user) { done(null, user) } 
//         else{ done(null, false) }
//     })
// })

passport.use(localStrategy)
passport.use(jwtStrategy)