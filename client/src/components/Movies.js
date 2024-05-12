import React, { useCallback, useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import authService from "../services/auth.service"
import movieService from '../services/movies.service'

import '../App.css'

function Movies() {
    const [movies, setMovies] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [values, setValues] = useState({
        title: '',
        description: '',
        rating: 1 
    })

    const navigate = useNavigate()

    const API_BASE = process.env.NODE_ENV === 'development'
    ? `http://localhost:9000/api`
    : process.env.REACT_APP_BASE_URL


    // const privateContent = () => {
    //     movieService.getAllPrivateMovies().then(
    //         response => {
    //             // console.log('res data', response.data)
    //             setMovies(response.data)
    //         },
    //         (error) => {
    //             console.log('Secured Page Error', error.response)
    //             if(error.response && error.response.status === 401){
    //                 authService.logout()
    //                 navigate('/')
    //             }
    //         }
    //     )
    // }

    const privateContent = useCallback(() => {
        movieService.getAllPrivateMovies().then(
                    response => {
                        // console.log('res data', response.data)
                        setMovies(response.data)
                    },
                    (error) => {
                        console.log('Secured Page Error', error.response)
                        if(error.response && error.response.status === 401){
                            authService.logout()
                            navigate('/')
                        }
                        setError(error.message)
                    }
                )
    }, [navigate])

    useEffect(() => {
        privateContent()
    }, [privateContent])

    const addMovie = async () => {
        try {
            await fetch(`${API_BASE}/movies`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            }).then(() => privateContent())
        } catch(error) {
                setError(error.message || "Unexpected Error")
        } finally {
                setLoading(false)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        addMovie()
    }

    const handleInputChanges = (e) => {
        e.persist()

        setValues((values) => ({
            ...values,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <div className="container">
            <div>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <label>
                        Title:
                        <input 
                        type='text' 
                        name='title' 
                        value={values.title} 
                        onChange={handleInputChanges} 
                        className="text-box" />
                    </label>

                    <label>
                        Description:
                        <input 
                        type='text' 
                        name='description' 
                        value={values.description} 
                        onChange={handleInputChanges} 
                        className="text-box "/>
                    </label>

                    <label>
                        Rating:
                        <input 
                        type='number'
                        name='rating'
                        value={values.rating}
                        onChange={handleInputChanges}
                        className='text-box' />
                    </label>

                    <input type='submit' value='Submit' className="submit-button"/>
                </form>
            </div>

            <div className="movie-output-container">
            {loading ? (
                <p>Loading...</p> // Display loading indicator if loading is true
            ) : error ? (
                <p>Error: {error}</p> // Display error message if error is present
            ) : (
                <ul>
                    {movies?.map(movie => (
                        <li key={movie._id}>
                            <Link to={`/movies/${movie._id}`}>{movie.title}</Link>
                        </li>
                    ))}
                </ul>
            )}
            </div>
        </div>
    );
}

export default Movies;