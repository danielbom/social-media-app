import axios from "axios";
import { PostsCreateBody } from "./types";

export class Config {
  constructor(public baseUrl: string) {}
}

class PostsEndpoint {
  constructor(public config: Config) {}

  getAll() {
    return axios.get(`${this.config.baseUrl}/posts`);
  }

  getById(id: any) {
    return axios.get(`${this.config.baseUrl}/posts/${id}`);
  }

  create(data: PostsCreateBody) {
    return axios.post(`${this.config.baseUrl}/posts`, data);
  }

  update(id: any, data: any) {
    return axios.put(`${this.config.baseUrl}/posts/${id}`, data);
  }

  delete(id: any) {
    return axios.delete(`${this.config.baseUrl}/posts/${id}`);
  }
}

class CommentsEndpoint {
  constructor(public config: Config) {}

  getAll() {
    return axios.get(`${this.config.baseUrl}/comments`);
  }

  getById(id: string) {
    return axios.get(`${this.config.baseUrl}/comments/${id}`);
  }

  create(data: any) {
    return axios.post(`${this.config.baseUrl}/comments`, data);
  }

  update(id: string, data: any) {
    return axios.put(`${this.config.baseUrl}/comments/${id}`, data);
  }

  delete(id: string) {
    return axios.delete(`${this.config.baseUrl}/comments/${id}`);
  }
}

export class Api {
  public posts: PostsEndpoint;
  public comments: CommentsEndpoint;

  constructor(public config: Config) {
    this.posts = new PostsEndpoint(config);
    this.comments = new CommentsEndpoint(config);
  }
}
