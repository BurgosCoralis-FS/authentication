const express = require('express')
const passport = require('passport')

const passportService = require('../services/passport')
const requireLogin = passport.authenticate('local', { session: false })
const router = express.Router()

const Users = require('../models/Users')
const authController = require('../controllers/authenticationController')

router.post('/', authController.signup)
router.post('/signin', requireLogin, authController.signin)
router.get('/', async (req, res) => {
    try {
        // res.send("test")
        const users = await Users.find()
        res.status(200).json(users)
    } catch(error) {
        res.status(500).json({ message: error.message })
    }
})


module.exports = router