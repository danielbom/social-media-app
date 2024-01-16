import axios from "axios";
import { Config } from "../Config";

export class CommentsEndpoint {
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
