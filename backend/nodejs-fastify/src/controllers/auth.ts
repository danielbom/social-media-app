import { MySQLConnection } from '@fastify/mysql'
import { FastifyInstance } from 'fastify'
import { AuthLoginBody, User } from '../core/types'
import { sanitizers } from '../core/sanitizers'
import { jwt } from '../core/jwt'

export function authController(fastify: FastifyInstance) {
  fastify.route({
    method: 'POST',
    url: '/auth/register',
    schema: {
      tags: ['Auth'],
      body: {
        type: 'object',
        properties: {
          username: { type: 'string' },
          password: { type: 'string' },
        },
        required: ['username', 'password'],
      },
    },
    handler: (request, reply) => {},
  })

  fastify.route({
    method: 'POST',
    url: '/auth/login',
    schema: {
      tags: ['Auth'],
      body: { $ref: 'AuthLoginBody#' },
      response: {
        200: { $ref: 'AuthLoginResponse#' },
      },
    },
    handler: async (request, reply) => {
      const { username, password } = request.body as AuthLoginBody
      const user = await getUserByUsername(fastify.mysql, username)
      if (!user) {
        reply.status(404).send({ message: 'User not found' })
      } else if (user.password !== password) {
        reply.status(401).send({ message: 'Invalid password' })
      } else {
        const access_token = jwt.createToken({
          sub: user.id,
          username: user.username,
          role: user.role,
        })
        reply.status(200).send({ access_token })
      }
    },
  })

  fastify.route({
    method: 'GET',
    url: '/auth/me',
    schema: {
      tags: ['Auth'],
      headers: {
        type: 'object',
        properties: {
          authorization: { type: 'string' },
        },
        required: ['authorization'],
      },
      response: { 200: { $ref: 'User#' } },
    },
    handler: (request, reply) => {},
  })
}

async function getUserByUsername(db: MySQLConnection, username: string): Promise<User | null> {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE username = ?', [username], (error, result) => {
      if (error) return reject(error)
      return resolve(sanitizers.User.one(result))
    })
  })
}
