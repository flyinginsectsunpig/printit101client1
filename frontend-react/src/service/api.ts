import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api", // matches our backend context-path
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
