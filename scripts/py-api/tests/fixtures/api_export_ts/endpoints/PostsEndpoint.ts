import { AxiosResponse } from "axios"
import { Config } from "../Config"

export class PostsEndpoint {
  constructor(public config: Config) {}

  getAll(): Promise<AxiosResponse<any>> {
    return this.config.instance.get(`/posts`)
  }

  getById(id: any): Promise<AxiosResponse<any>> {
    return this.config.instance.get(`/posts/${id}`)
  }

  create(data: PostsCreateBody): Promise<AxiosResponse<any>> {
    return this.config.instance.post(`/posts`, data)
  }

  update(id: any, data: PostsUpdateBody): Promise<AxiosResponse<any>> {
    return this.config.instance.put(`/posts/${id}`, data)
  }

  delete(id: any): Promise<AxiosResponse<any>> {
    return this.config.instance.delete(`/posts/${id}`)
  }
}

export type PostsCreateBody = {
  title: string,
  content: string,
  author?: string
}

export type PostsUpdateBody = {
  content: string
}
