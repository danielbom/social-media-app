import axios from "axios";
import https from "https";

const api = axios.create({
    baseURL: "https://localhost:5501",
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    }),
    headers: {
        "Content-Type": "application/json"
    }
});

class Api {
    constructor() {
        this.token = "";
    }

    async register({ username, password }) {
        return await api.post("/Auth/Register", { username, password });
    }

    async login({ username, password }) {
        const loginResponse = await api.post("/Auth/Login", { username, password });
        this.token = loginResponse.data.token;
        return loginResponse;
    }

    async createPost({ content }) {
        return await api.post("/Posts", { content });
    }

    async commentPost(postId, { content }) {
        return await api.post(`/Posts/${postId}/Comments`, { content });
    }

    async answerComment(commentId, { content }) {
        return await api.post(`/Comments/${commentId}/Answers`, { content })   
    }

    enableAuthentication(token = null) {
        api.defaults.headers.common.Authorization = `Bearer ${token || this.token}`;
    }

    disableAuthentication() {
        delete api.defaults.headers.common.Authorization;
    }
}

export default new Api();