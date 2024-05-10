const express = require('express')
const passport = require('passport')

const passportService = require('../services/passport')
const protectedRoute = passport.authenticate('jwt', { session: false })
const router = express.Router()

const Movie = require('../models/Movies')

const getMovie = async (req, res, next) => {
    let movie
    try {
        movie = await Movie.findById(req.params.id)
        if(movie === null){
            return res.status(404).json({ message: "movie not found" })
        }
    } catch(error) {
        return res.status(500).json({ message: error.message })
    }
    res.movie = movie
    next()
}

router.get('/', protectedRoute, async (req, res) => {
    try {
        // res.send("test")
        const movies = await Movie.find()
        res.status(200).json(movies)
    } catch(error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/:id', getMovie, async (req, res)=> {
    res.json(res.movie)
})

router.post('/', async (req, res) => {
    // res.send("test")
    const movie = new Movie({
        title: req.body.title,
        description: req.body.description,
        rating: req.body.rating,
    })
    try {
        const newMovie = await movie.save()
        res.status(201).json(newMovie)
    } catch(error) {
        res.status(400).json({ message: error.message })
    }
})

router.patch('/:id', getMovie, async (req, res) => {
    // res.send("test")
    if (req.body.title != null){
        res.movie.title = req.body.title
    }
    if (req.body.description != null){
        res.movie.description = req.body.description
    }
    if (req.body.rating != null){
        res.movie.rating = req.body.rating
    }

    try {
        const updatedMovie = await res.movie.save()
        res.status(200).json(updatedMovie)
    } catch(error) {
        res.status(400).json({ message: error.message })
    }
})

router.delete('/:id', getMovie, async(req, res) => {
    try {
        const id = req.params.id
        await Movie.deleteOne({ _id: id })
        res.json({message: "Removed movie"})
    } catch(error){
        res.status(500).json({ message: error.message })
    }
})

module.exports = router