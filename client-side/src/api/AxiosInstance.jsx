import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API,
    withCredentials:true,
})

// Add authorization header automatically

api.interceptors.request.use((config) => {
    const authData = localStorage.getItem('auth');
    console.log("AuthData",authData)
    if(authData){
        const parsed = JSON.parse(authData)
        
        if(parsed.token){
            config.headers.Authorization = `Bearer ${parsed.token}`
        }
    }

    if(config.data instanceof FormData){
        config.headers["Content-Type"] = "multipart/form-data"
    } else{
        config.headers["Content-Type"] = "application/json"
    }

    config.headers["Accept"] = "application/json"

    return config;
})

export default api;