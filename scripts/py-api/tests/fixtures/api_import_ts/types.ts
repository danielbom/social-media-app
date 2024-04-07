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
