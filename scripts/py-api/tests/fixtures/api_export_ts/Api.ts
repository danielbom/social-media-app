import { Config } from "./Config"
import { PostsEndpoint } from "./endpoints/PostsEndpoint"
import { CommentsEndpoint } from "./endpoints/CommentsEndpoint"

export class Api {
  public posts: PostsEndpoint
  public comments: CommentsEndpoint

  constructor(public config: Config) {
    this.posts = new PostsEndpoint(config)
    this.comments = new CommentsEndpoint(config)
  }
}
