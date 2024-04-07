import Fastify from 'fastify'
import fastifyMysql from '@fastify/mysql'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'

import ajvMergePatch from 'ajv-merge-patch'

import { authController } from './controllers/auth'
import { commentsController } from './controllers/comments'
import { postsController } from './controllers/posts'
import { usersController } from './controllers/users'
import { addApiSchemas } from './core/schemas'

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
    ajv: {
      plugins: [ajvMergePatch],
      customOptions: {
        keywords: ['collectionFormat'],
      },
    },
  })

  await fastify.register(fastifySwagger)

  await fastify.register(fastifySwaggerUi, {
    routePrefix: '/swagger',
    uiConfig: {
      docExpansion: 'none',
      deepLinking: true,
    },
  })

  await fastify.register(fastifyMysql, {
    connectionString: 'mysql://root:root@localhost:3306/nodejs_fastify',
  })

  addApiSchemas(fastify)

  fastify.get('/', { schema: { hide: true } }, async function handler(_request, reply) {
    reply.send('Healthy!')
  })

  authController(fastify)
  commentsController(fastify)
  postsController(fastify)
  usersController(fastify)

  await fastify.ready()
  // fastify.swagger()

  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

bootstrap()
