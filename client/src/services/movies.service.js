import axios from "axios"
import authHeader from "./authHeader"

const API_BASE = process.env.NODE_ENV === 'development'
    ? `http://localhost:9000/api`
    : process.env.REACT_APP_BASE_URL

const API_URL = '/movies'

const getAllPrivateMovies = () => {
    return axios.get(`${API_BASE}${API_URL}`, { headers: authHeader() })
}

const movieService = {
    getAllPrivateMovies
}

export default movieService