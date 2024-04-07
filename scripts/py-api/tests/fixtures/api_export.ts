import { AxiosInstance, AxiosResponse } from "axios"

export class Config {
  constructor(public instance: AxiosInstance) {}
}

class PostsEndpoint {
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

class CommentsEndpoint {
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

export class Api {
  public posts: PostsEndpoint
  public comments: CommentsEndpoint

  constructor(public config: Config) {
    this.posts = new PostsEndpoint(config)
    this.comments = new CommentsEndpoint(config)
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

export type CommentsCreateBody = {
  content: string,
  author?: string
}

export type CommentsUpdateBody = {
  content: string
}
