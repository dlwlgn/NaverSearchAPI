const axios = require('axios');
const api = axios.create({
    baseURL: "http://15.164.48.55:8000/api/data"
});

export const dataLap = {
    get: () => {
        return api.get("/");
    },
    post: (data) => {
        return api.post("/", data);
    }, 
    delete: () => {
        return api.delete("/");
    }
}