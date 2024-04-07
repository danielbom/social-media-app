import { FastifyInstance } from 'fastify'
import { CreateCommentAnswerBody, CreateCommentBody, IdParams, Pagination, UpdateCommentBody } from '../core/types'
import { sanitizers } from '../core/sanitizers'

export function commentsController(fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/comments',
    schema: {
      tags: ['Comments'],
      body: { $ref: 'CreateCommentBody#' },
      response: {
        201: { $ref: 'Comment#' },
      },
    },
    handler: (request, reply) => {
      const { content, post_id } = request.body as CreateCommentBody
      const { mysql } = fastify
      mysql.query(
        'INSERT INTO comments (id, content, post_id) VALUES (ordered_uuid(uuid()), ?, ?)',
        [content, post_id],
        function onResult(err, result) {
          if (err) {
            reply.status(500).send(err)
          } else {
            reply.status(200).send(sanitizers.Comment.one(result))
          }
        },
      )
    },
  })

  fastify.route({
    method: 'POST',
    url: '/comments/answer',
    schema: {
      tags: ['Comments'],
      body: { $ref: 'CreateCommentAnswerBody#' },
      response: {
        201: { $ref: 'Comment#' },
      },
    },
    handler: (request, reply) => {
      const { content, comment_id } = request.body as CreateCommentAnswerBody
      const { mysql } = fastify
      mysql.query(
        'INSERT INTO comments (id, content, comment_id) VALUES (ordered_uuid(uuid()), ?, ?)',
        [content, comment_id],
        function onResult(err, result) {
          if (err) {
            reply.status(500).send(err)
          } else {
            reply.status(200).send(sanitizers.Comment.one(result))
          }
        },
      )
    },
  })

  fastify.route({
    method: 'GET',
    url: '/comments',
    schema: {
      tags: ['Comments'],
      querystring: { $ref: 'Pagination#' },
      response: {
        200: {
          type: 'array',
          items: { $ref: 'Comment#' },
        },
      },
    },
    handler: (request, reply) => {
      const { page, page_size } = request.query as Pagination
      console.log(page, page_size)
      const { mysql } = fastify
      mysql.query(
        'SELECT * FROM comments ORDER BY created_at DESC LIMIT ? OFFSET ?',
        [page_size, (page - 1) * page_size],
        function onResult(err, result) {
          if (err) {
            reply.status(500).send(err)
          } else {
            reply.status(200).send(sanitizers.Comment.many(result))
          }
        },
      )
    },
  })

  fastify.route({
    method: 'GET',
    url: '/comments/:id',
    schema: {
      tags: ['Comments'],
      params: { $ref: 'IdParams#' },
      response: {
        200: { $ref: 'Comment#' },
      },
    },
    handler: (request, reply) => {
      const { id } = request.params as IdParams
      const { mysql } = fastify
      mysql.query('SELECT * FROM comments WHERE id = ?', [id], function onResult(err, result) {
        if (err) {
          reply.status(500).send(err)
        } else {
          reply.status(200).send(sanitizers.Comment.one(result))
        }
      })
    },
  })

  fastify.route({
    method: 'PUT',
    url: '/comments/:id',
    schema: {
      tags: ['Comments'],
      params: { $ref: 'IdParams#' },
      body: { $ref: 'UpdateCommentBody#' },
      response: {
        200: { $ref: 'Comment#' },
      },
    },
    handler: (request, reply) => {
      const { id } = request.params as IdParams
      const { content } = request.body as UpdateCommentBody
      const { mysql } = fastify
      mysql.query(
        'UPDATE comments SET content = ? WHERE id = ? RETURNING *',
        [content, id],
        function onResult(err, result) {
          if (err) {
            reply.status(500).send(err)
          } else {
            reply.status(200).send(sanitizers.Comment.one(result))
          }
        },
      )
    },
  })

  fastify.route({
    method: 'DELETE',
    url: '/comments/:id',
    schema: {
      tags: ['Comments'],
      params: { $ref: 'IdParams#' },
      response: {
        204: { type: 'string' },
      },
    },
    handler: (request, reply) => {
      const { id } = request.params as IdParams
      const { mysql } = fastify
      mysql.query('DELETE FROM comments WHERE id = ?', [id], function onResult(err, result) {
        if (err) {
          reply.status(500).send(err)
        } else {
          reply.status(204).send('')
        }
      })
    },
  })
}
