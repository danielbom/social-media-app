import { AxiosResponse } from "axios"
import { Config } from "../Config"
import { CommentsCreateBody, CommentsUpdateBody } from "../types"

export class CommentsEndpoint {
  constructor(public config: Config) {}

  getAll(): Promise<AxiosResponse<any>> {
    return this.config.instance.get(`/comments`)
  }

  getById(id: string): Promise<AxiosResponse<any>> {
    return this.config.instance.get(`/comments/${id}`)
  }

  create(data: CommentsCreateBody): Promise<AxiosResponse<any>> {
    return this.config.instance.post(`/comments`, data)
  }

  update(id: string, data: CommentsUpdateBody): Promise<AxiosResponse<any>> {
    return this.config.instance.put(`/comments/${id}`, data)
  }

  delete(id: string): Promise<AxiosResponse<any>> {
    return this.config.instance.delete(`/comments/${id}`)
  }
}
