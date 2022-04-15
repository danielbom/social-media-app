import Api from "./Api.js";

export class InitialFlow {
    constructor({ username, password }) {
        this.username = username;
        this.password = password;
    }

    async registerUser() {
        await Api.register({ username: "user", password: "123mudar" });
    }

    async doLogin() {
        await Api.login({
            username: this.username,
            password: this.password
        });
        Api.enableAuthentication();
    }

    async createFirstPost() {
        const postResponse = await Api.createPost({
            content: "Meu primeiro post como administrador"
        });
        return postResponse.data.id;
    }

    async commentFirstPost(postId) {
        const postCommentResponse = await Api.commentPost(postId, {
            content: "Este comentario foi desnecessario"
        });
        return postCommentResponse.data.id;
    }

    async answerFirstComment(commentId) {
        const commentAnswerResponse = await Api.answerComment(commentId, {
            content: "Okay"
        });
        return commentAnswerResponse.data.id;
    }

    async finishThreadComments(answerId) {
        await Api.answerComment(answerId, {
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