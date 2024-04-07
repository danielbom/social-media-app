import { FastifyInstance } from 'fastify'
import { CreateUserBody, IdParams, Pagination } from '../core/types'
import { sanitizers } from '../core/sanitizers'

export function usersController(fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/users',
    schema: {
      tags: ['Users'],
      body: { $ref: 'CreateUserBody#' },
      response: {
        200: { $ref: 'User#' },
      },
    },
    handler: (request, reply) => {
      const { username, password, role } = request.body as CreateUserBody
      fastify.mysql.query(
        `INSERT INTO users (id, username, password, role) VALUES (ordered_uuid(uuid()), ?, ?, ?)`,
        [username, password, role],
        function onResult(err, result) {
          if (err) {
            reply.status(500).send(err)
          } else {
            reply.status(200).send(sanitizers.User.one(result))
          }
        },
      )
    },
  })

  fastify.route({
    method: 'GET',
    url: '/users',
    schema: {
      tags: ['Users'],
      querystring: { $ref: 'Pagination#' },
      response: {
        200: {
          type: 'array',
          items: { $ref: 'User#' },
        },
      },
    },
    handler: (request, reply) => {
      const { page, page_size } = request.query as Pagination
      fastify.mysql.query(
        `SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?`,
        [page_size, page_size * (page - 1)],
        function onResult(err, result) {
          if (err) {
            reply.status(500).send(err)
          } else {
            reply.status(200).send(sanitizers.User.many(result))
          }
        },
      )
    },
  })

  fastify.route({
    method: 'GET',
    url: '/users/:id',
    schema: {
      tags: ['Users'],
      params: { $ref: 'IdParams#' },
      response: {
        200: { $ref: 'User#' },
      },
    },
    handler: (request, reply) => {
      const { id } = request.params as IdParams
      fastify.mysql.query(`SELECT * FROM users WHERE id = ?`, [id], function onResult(err, result) {
        if (err) {
          reply.status(500).send(err)
        } else {
          reply.status(200).send(sanitizers.User.one(result))
        }
      })
    },
  })

  fastify.route({
    method: 'PUT',
    url: '/users/:id',
    schema: {
      tags: ['Users'],
      params: { $ref: 'IdParams#' },
      body: { $ref: 'CreateUserBody#' },
      response: {
        200: { $ref: 'User#' },
      },
    },
    handler: (request, reply) => {
      const { id } = request.params as IdParams
      const { username, password, role } = request.body as CreateUserBody
      fastify.mysql.query(
        `UPDATE users SET username = ?, password = ?, role = ? WHERE id = ? RETURNING *`,
        [username, password, role, id],
        function onResult(err, result) {
          if (err) {
            reply.status(500).send(err)
          } else {
            reply.status(200).send(sanitizers.User.one(result))
          }
        },
      )
    },
  })

  fastify.route({
    method: 'DELETE',
    url: '/users/:id',
    schema: {
      tags: ['Users'],
      params: { $ref: 'IdParams#' },
      response: {
        204: { type: 'string' },
      },
    },
    handler: (request, reply) => {
      const { id } = request.params as IdParams
      fastify.mysql.query(`DELETE FROM users WHERE id = ?`, [id], function onResult(err, result) {
        if (err) {
          reply.status(500).send(err)
        } else {
          reply.status(204).send('')
        }
      })
    },
  })
}
