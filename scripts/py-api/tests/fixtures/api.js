import axios from "axios";

export class Config {
  constructor(baseUrl, headers = {}) {
    this.baseUrl = baseUrl;
    this.headers = headers;
  }
}

class PostsEndpoint {
  constructor(config) {
    this._config = config;
  }

  getAll() {
    return axios.get(`${this._config.baseUrl}/posts`, { headers: this._config.headers });
  }

  getById(id) {
    return axios.get(`${this._config.baseUrl}/posts/${id}`, { headers: this._config.headers });
  }

  create(data) {
    return axios.post(`${this._config.baseUrl}/posts`, data, { headers: this._config.headers });
  }

  update(id, data) {
    return axios.put(`${this._config.baseUrl}/posts/${id}`, data, { headers: this._config.headers });
  }

  delete(id) {
    return axios.delete(`${this._config.baseUrl}/posts/${id}`, { headers: this._config.headers });
  }
}

class CommentsEndpoint {
  constructor(config) {
    this._config = config;
  }

  getAll() {
    return axios.get(`${this._config.baseUrl}/comments`, { headers: this._config.headers });
  }

  getById(id) {
    return axios.get(`${this._config.baseUrl}/comments/${id}`, { headers: this._config.headers });
  }

  create(data) {
    return axios.post(`${this._config.baseUrl}/comments`, data, { headers: this._config.headers });
  }

  update(id, data) {
    return axios.put(`${this._config.baseUrl}/comments/${id}`, data, { headers: this._config.headers });
  }

  delete(id) {
    return axios.delete(`${this._config.baseUrl}/comments/${id}`, { headers: this._config.headers });
  }
}

export class Api {
  constructor(config) {
    this._config = config;
    this.posts = new PostsEndpoint(config);
    this.comments = new CommentsEndpoint(config);
  }
}
