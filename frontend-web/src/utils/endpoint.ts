import axios from "axios";

const ENDPOINT = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const endpoint = axios.create({
    baseURL: ENDPOINT,
    headers: {
        "Content-Type": "application/json",
    },
});