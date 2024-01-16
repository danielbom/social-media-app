import axios from "axios";
import { Config } from "../Config";

export class PostsEndpoint {
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

export type PostsCreateBody = any;
