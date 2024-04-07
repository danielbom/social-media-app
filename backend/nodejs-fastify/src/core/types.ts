export type Pagination = {
  page: number
  page_size: number
}

export type IdParams = {
  id: string
}

export type AuthLoginBody = {
  username: string
  password: string
}

export type AuthRegisterBody = {
  username: string
  password: string
}

export type Comment = {
  id: string
  content: string
  post_parent_id: string | null
  comment_parent_id: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type CreateCommentBody = {
  content: string
  post_id: number
}

export type UpdateCommentBody = {
  content: string
}

export type CreateCommentAnswerBody = {
  content: string
  comment_id: number
}

export type Post = {
  id: string
  title: string
  content: string
  author_id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type CreatePostBody = {
  title: string
  content: string
}

export type UpdatePostBody = {
  title: string
  content: string
}

export type User = {
  id: string
  username: string
  password: string
  role: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type CreateUserBody = {
  username: string
  password: string
  role: string
}

export type UpdateUserBody = {
  username: string
  password: string
  role: string
}
