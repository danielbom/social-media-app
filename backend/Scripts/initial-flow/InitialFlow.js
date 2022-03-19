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

export class InitialFlow {
    constructor({ username, password }) {
        this.username = username;
        this.password = password;
    }

    async registerUser() {
        await api.post("/Auth/Register", { username: "user", password: "123mudar" });
    }

    async doLogin() {
        const loginResponse = await api.post("/Auth/Login", {
            username: this.username,
            password: this.password
        });
        const { token } = loginResponse.data;
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
    }

    async createFirstPost() {
        const postResponse = await api.post("/Post", {
            content: "Meu primeiro post como administrador"
        });
        return postResponse.data.id;
    }

    async commentFirstPost(postId) {
        const postCommentResponse = await api.post(`/Post/${postId}/Comment`, {
            content: "Este comentario foi desnecessario"
        });
        return postCommentResponse.data.id;
    }

    async answerFirstComment(commentId) {
        const commentAnswerResponse = await api.post(`/Comment/${commentId}/Answer`, {
            content: "Okay"
        });
        return commentAnswerResponse.data.id;
    }

    async finishThreadComments(answerId) {
        await api.post(`/Comment/${answerId}/Answer`, {
            content: "Fechou"
        });
    }

    async execute() {
        await this.doLogin();
        const postId = await this.createFirstPost();
        const commentId = await this.commentFirstPost(postId);
        const answerId = await this.answerFirstComment(commentId);
        await this.finishThreadComments(answerId);
        await this.registerUser();
    }
}