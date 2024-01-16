import axios from "axios";

export class Config {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }
}

class PostsEndpoint {
  constructor(config) {
    this.config = config;
  }

  getAll() {
    return axios.get(`${this.config.baseUrl}/posts`);
  }

  getById(id) {
    return axios.get(`${this.config.baseUrl}/posts/${id}`);
  }

  create(data) {
    return axios.post(`${this.config.baseUrl}/posts`, data);
  }

  update(id, data) {
    return axios.put(`${this.config.baseUrl}/posts/${id}`, data);
  }

  delete(id) {
    return axios.delete(`${this.config.baseUrl}/posts/${id}`);
  }
}

class CommentsEndpoint {
  constructor(config) {
    this.config = config;
  }

  getAll() {
    return axios.get(`${this.config.baseUrl}/comments`);
  }

  getById(id) {
    return axios.get(`${this.config.baseUrl}/comments/${id}`);
  }

  create(data) {
    return axios.post(`${this.config.baseUrl}/comments`, data);
  }

  update(id, data) {
    return axios.put(`${this.config.baseUrl}/comments/${id}`, data);
  }

  delete(id) {
    return axios.delete(`${this.config.baseUrl}/comments/${id}`);
  }
}

export class Api {
  constructor(config) {
    this.config = config;
    this.posts = new PostsEndpoint(config);
    this.comments = new CommentsEndpoint(config);
  }
}
