const axios = require("axios")
const api = axios.create({
    baseURL: "http://localhost:5000",
    headers: {
        "Content-Type": "application/json"
    }
})

export const googleLogin = (token) => api.get("/google", { token })