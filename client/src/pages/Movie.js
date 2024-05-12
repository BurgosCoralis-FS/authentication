import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';

import '../App.css';
import Header from "../components/Header";

function Movie() {
    const [movies, setMovies] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const [values, setValues] = useState({
        title: '',
        description: '',
        rating: 1
    })

    const { id } = useParams();
    const navigate = useNavigate();
    const ignore = useRef(false);

    const API_BASE = process.env.NODE_ENV === 'development'
    ? `http://localhost:9000/api`
    : process.env.REACT_APP_BASE_URL;
	
	useEffect(() => {
        const getMovie = async () => {
            setLoading(true)
            try {
                await fetch(`${API_BASE}/movies/${id}`)
                        .then(res => res.json())
                        .then(data => {
                            console.log({data})
                            setValues({
                                title: data.title,
                                description: data.description,
                                rating: data.rating
                            })
                        })
            } catch(error) {
                setError(error.message || "Unexpected Error")
            } finally {
                setLoading(false)
            }
        }

        ignore.current = false;
        getMovie();

        return () => {
            ignore.current = true;
        }
	}, [API_BASE, id])

	const deleteMovie = async () => {
		try {
			await fetch(`${API_BASE}/movies/${id}`, {
				method: 'DELETE'
			})
                    .then(res => res.json())
                    .then(data => {
                    setMovies(data)
                    navigate("/dashboard", { replace: true })
                    })
		} catch(error) {
			setError(error.message || "Unexpected Error")
		} finally {
			setLoading(false)
		}
	}

	const updateMovie = async () => {
		try {
			await fetch(`${API_BASE}/movies/${id}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(values)
        })
                    .then(res => res.json())
                    .then(data => {
                    console.log({data})
                    })
		} catch(error) {
			setError(error.message || "Unexpected Error")
		} finally {
			setLoading(false)
		}
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		updateMovie()
	}

	const handleInputChanges = (e) => {
        e.persist()

        setValues((values) => ({
            ...values,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <div>
            <Header />
            <div className="container">
                <form onSubmit={(event) => handleSubmit(event)}>
                    <label>
                        Title:
                        <input 
                        type={"text"} 
                        name='title' 
                        value={values.title} 
                        onChange={handleInputChanges} 
                        className="text-box" />
                    </label>

                    <label>
                        Description:
                        <input 
                        type={"text"} 
                        name='description' 
                        value={values.description} 
                        onChange={handleInputChanges} 
                        className="text-box "/>
                    </label>

                    <label>
                        Rating:
                        <input 
                        type={"number"} 
                        name='rating' 
                        value={values.rating} 
                        onChange={handleInputChanges} 
                        className="text-box "/>
                    </label>

                    <input type={"submit"} value='Submit' className="submit-button"/>
                </form>

                <div className="movie-output-container">
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p>Error: {error}</p>
                    ) : (
                        <>
                            <h1>{values && values.title}</h1>
                            <h2>{values && values.description}</h2>
                            <h3 style={styles.text}>Rating: {values && values.rating}</h3>
                            <button onClick={() => deleteMovie()} className='submit-button'>Delete Movie</button>
                        </>
                    )}
                    <p className="unused-variable">{movies}</p>
                </div>
            </div>
        </div>
    )
}

export default Movie

const styles = {
    text: {
        color: 'black'
    }
}