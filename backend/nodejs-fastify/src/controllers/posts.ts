import { FastifyInstance } from 'fastify'
import { CreatePostBody, IdParams, Pagination, UpdatePostBody } from '../core/types'
import { sanitizers } from '../core/sanitizers'

export function postsController(fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/posts',
    schema: {
      tags: ['Posts'],
      body: { $ref: 'CreatePostBody#' },
    },
    handler: (request, reply) => {
      const { title, content } = request.body as CreatePostBody
      fastify.mysql.query(
        `INSERT INTO posts (id, title, content) VALUES (ordered_uuid(uuid()), ?, ?)`,
        [title, content],
        function onResult(err, result) {
          if (err) {
            reply.status(500).send(err)
          } else {
            reply.status(200).send(sanitizers.Post.one(result))
          }
        },
      )
    },
  })

  fastify.route({
    method: 'GET',
    url: '/posts',
    schema: {
      tags: ['Posts'],
      querystring: { $ref: 'Pagination#' },
      response: {
        200: {
          type: 'array',
          items: { $ref: 'Post#' },
        },
      },
    },
    handler: (request, reply) => {
      const { page, page_size } = request.query as Pagination
      fastify.mysql.query(
        `SELECT * FROM posts ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [page_size, page_size * (page - 1)],
        function onResult(err, result) {
          if (err) {
            reply.status(500).send(err)
          } else {
            reply.status(200).send(sanitizers.Post.many(result))
          }
        },
      )
    },
  })

  fastify.route({
    method: 'GET',
    url: '/posts/:id',
    schema: {
      tags: ['Posts'],
      params: { $ref: 'IdParams#' },
      response: {
        200: { $ref: 'Post#' },
      },
    },
    handler: (request, reply) => {
      const { id } = request.params as IdParams
      fastify.mysql.query(`SELECT * FROM posts WHERE id = ?`, [id], function onResult(err, result) {
        if (err) {
          reply.status(500).send(err)
        } else {
          reply.status(200).send(sanitizers.Post.one(result))
        }
      })
    },
  })

  fastify.route({
    method: 'PUT',
    url: '/posts/:id',
    schema: {
      tags: ['Posts'],
      params: { $ref: 'IdParams#' },
      body: { $ref: 'UpdatePostBody#' },
    },
    handler: (request, reply) => {
      const { id } = request.params as IdParams
      const { title, content } = request.body as UpdatePostBody
      fastify.mysql.query(
        `UPDATE posts SET title = ?, content = ? WHERE id = ? RETURNING *`,
        [title, content, id],
        function onResult(err, result) {
          if (err) {
            reply.status(500).send(err)
          } else {
            reply.status(200).send(sanitizers.Post.one(result))
          }
        },
      )
    },
  })

  fastify.route({
    method: 'DELETE',
    url: '/posts/:id',
    schema: {
      tags: ['Posts'],
      params: { $ref: 'IdParams#' },
      response: {
        204: { type: 'string' },
      },
    },
    handler: (request, reply) => {
      const { id } = request.params as IdParams
      fastify.mysql.query(`DELETE FROM posts WHERE id = ?`, [id], function onResult(err, result) {
        if (err) {
          reply.status(500).send(err)
        } else {
          reply.status(204).send('')
        }
      })
    },
  })
}
