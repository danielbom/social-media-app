import { Sanitizer } from './sanitize-types'
import { Comment, Post, User } from './types'

export const sanitizers = {
  Comment: new Sanitizer<Comment>(
    {
      id: (it) => typeof it === 'string',
      content: (it) => typeof it === 'string',
      comment_parent_id: (it) => typeof it === 'string' || it === null,
      post_parent_id: (it) => typeof it === 'string' || it === null,
      created_at: (it) => typeof it === 'string',
      updated_at: (it) => typeof it === 'string',
      deleted_at: (it) => typeof it === 'string' || it === null,
    },
    { uuidFields: ['id'] },
  ),

  User: new Sanitizer<User>(
    {
      id: (it) => typeof it === 'string',
      username: (it) => typeof it === 'string',
      password: (it) => typeof it === 'string',
      role: (it) => typeof it === 'string',
      created_at: (it) => typeof it === 'string',
      updated_at: (it) => typeof it === 'string',
      deleted_at: (it) => typeof it === 'string' || it === null,
    },
    { uuidFields: ['id'] },
  ),

  Post: new Sanitizer<Post>(
    {
      id: (it) => typeof it === 'string',
      author_id: (it) => typeof it === 'string',
      content: (it) => typeof it === 'string',
      created_at: (it) => typeof it === 'string',
      deleted_at: (it) => typeof it === 'string' || it === null,
      title: (it) => typeof it === 'string',
      updated_at: (it) => typeof it === 'string',
    },
    { uuidFields: ['id', 'author_id'] },
  ),
}
