import { FastifyInstance } from 'fastify'
import {
  Pagination,
  IdParams,
  Comment,
  CreateCommentBody,
  UpdateCommentBody,
  CreateCommentAnswerBody,
  Post,
  CreatePostBody,
  UpdatePostBody,
  User,
  CreateUserBody,
  UpdateUserBody,
  AuthLoginBody,
} from './types'

type Props<T> = { [K in keyof T]: unknown }
type NoProps<T, U> = Omit<{ [K in keyof U]: never }, keyof T>
type ExactProps<T, U> = Props<T> & NoProps<T, U>

function props<T>() {
  return <U extends ExactProps<T, U>>(u: U): U => u
}

function addCoreSchemas(fastify: FastifyInstance) {
  fastify.addSchema({
    $id: 'Uuid',
    type: 'string',
    format: 'uuid',
  })

  fastify.addSchema({
    $id: 'Pagination',
    type: 'object',
    properties: props<Pagination>()({
      page: { type: 'number', default: 1, minimum: 1 },
      page_size: { type: 'number', default: 10, minimum: 1 },
    }),
  })

  fastify.addSchema({
    $id: 'IdParams',
    type: 'object',
    properties: props<IdParams>()({
      id: { $ref: 'Uuid#' },
    }),
  })
}

function addCommentSchemas(fastify: FastifyInstance) {
  fastify.addSchema({
    $id: 'AuthLoginBody',
    type: 'object',
    properties: props<AuthLoginBody>()({
      username: { type: 'string' },
      password: { type: 'string' },
    }),
    required: ['username', 'password'],
    additionalProperties: false,
  })

  fastify.addSchema({
    $id: 'AuthLoginResponse',
    type: 'object',
    properties: {
      access_token: { type: 'string' },
    },
    required: ['access_token'],
    additionalProperties: false,
  })

  fastify.addSchema({
    $id: 'Comment',
    type: 'object',
    properties: props<Comment>()({
      id: { $ref: 'Uuid#' },
      content: { type: 'string' },
      post_parent_id: { $ref: 'Uuid#' },
      comment_parent_id: { $ref: 'Uuid#' },
      created_at: { type: 'string' },
      updated_at: { type: 'string' },
      deleted_at: { type: 'string' },
    }),
    additionalProperties: false,
  })

  fastify.addSchema({
    $id: 'CreateCommentBody',
    type: 'object',
    properties: props<CreateCommentBody>()({
      content: { type: 'string' },
      post_id: { type: 'number' },
    }),
    additionalProperties: false,
  })

  fastify.addSchema({
    $id: 'UpdateCommentBody',
    type: 'object',
    properties: props<UpdateCommentBody>()({
      content: { type: 'string' },
    }),
    additionalProperties: false,
  })

  fastify.addSchema({
    $id: 'CreateCommentAnswerBody',
    type: 'object',
    properties: props<CreateCommentAnswerBody>()({
      content: { type: 'string' },
      comment_id: { type: 'number' },
    }),
    additionalProperties: false,
  })
}

function addPostSchemas(fastify: FastifyInstance) {
  fastify.addSchema({
    $id: 'Post',
    type: 'object',
    properties: props<Post>()({
      id: { $ref: 'Uuid#' },
      title: { type: 'string' },
      content: { type: 'string' },
      author_id: { $ref: 'Uuid#' },
      created_at: { type: 'string' },
      updated_at: { type: 'string' },
      deleted_at: { type: 'string' },
    }),
    additionalProperties: false,
  })

  fastify.addSchema({
    $id: 'CreatePostBody',
    type: 'object',
    properties: props<CreatePostBody>()({
      title: { type: 'string' },
      content: { type: 'string' },
    }),
    required: ['title', 'content'],
    additionalProperties: false,
  })

  fastify.addSchema({
    $id: 'UpdatePostBody',
    type: 'object',
    properties: props<UpdatePostBody>()({
      title: { type: 'string' },
      content: { type: 'string' },
    }),
    additionalProperties: false,
  })
}

function addUserSchemas(fastify: FastifyInstance) {
  fastify.addSchema({
    $id: 'User',
    type: 'object',
    properties: props<User>()({
      id: { $ref: 'Uuid#' },
      username: { type: 'string' },
      password: { type: 'string' },
      role: { type: 'string' },
      created_at: { type: 'string' },
      updated_at: { type: 'string' },
      deleted_at: { type: 'string' },
    }),
    additionalProperties: false,
  })

  fastify.addSchema({
    $id: 'CreateUserBody',
    type: 'object',
    properties: props<CreateUserBody>()({
      username: { type: 'string' },
      password: { type: 'string' },
      role: { type: 'string' },
    }),
    required: ['username', 'password', 'role'],
    additionalProperties: false,
  })

  fastify.addSchema({
    $id: 'UpdateUserBody',
    type: 'object',
    properties: props<UpdateUserBody>()({
      username: { type: 'string' },
      password: { type: 'string' },
      role: { type: 'string' },
    }),
    additionalProperties: false,
  })
}

export function addApiSchemas(fastify: FastifyInstance) {
  addCoreSchemas(fastify)
  addCommentSchemas(fastify)
  addPostSchemas(fastify)
  addUserSchemas(fastify)
}
