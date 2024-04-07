// Add mysql to the fastify instance
import { FastifyInstance } from 'fastify'
import { MySQLConnection } from '@fastify/mysql'

declare module 'fastify' {
  interface FastifyInstance {
    mysql: MySQLConnection
  }
}
