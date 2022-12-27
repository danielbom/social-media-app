/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Joi from 'joi';

const nodeEnv = process.env.NODE_ENV ?? 'development';

const env = {
  database: {
    host: process.env.MYSQL_HOST!,
    port: +process.env.MYSQL_PORT!,
    user: process.env.MYSQL_USER!,
    password: process.env.MYSQL_PASSWORD!,
    database: process.env.MYSQL_DATABASE!,
  },
  app: {
    nodeEnv,
    isTest: nodeEnv === 'test',
    isDevelopment: nodeEnv === 'development' || nodeEnv === 'debug',
    isProduction: nodeEnv === 'production',
    isDebug: nodeEnv === 'debug',
    port: +process.env.APP_PORT!,
    cors: process.env.APP_CORS!,
    adminPassword: process.env.APP_ADMIN_PASSWORD!,
  },
  ws: {
    port: +process.env.WS_PORT!,
    cors: process.env.WS_CORS!,
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN!, // https://github.com/zeit/ms.js
  },
  adminJs: {
    enable: process.env.ADMINJS_ENABLE === 'true',
    session: {
      secret: process.env.ADMINJS_SESSION_SECRET!
    },
    auth: {
      cookieName: process.env.ADMINJS_AUTH_COOKIE_NAME!,
      cookiePassword: process.env.ADMINJS_AUTH_COOKIE_PASSWORD!,
    },
  }
};

(function ensureSafeEnvironments() {
  if (env.app.isTest) {
    // In the test environment all the configuration should come with your test
    const anyEnv = env as any;
    anyEnv.jwt = {};
    anyEnv.app = {};
    anyEnv.database = {};
    return;
  }

  const cors = Joi.string()
    .required()
    .regex(/^[^;]+(;[^;]+)*$/, { name: 'list of origins' });
  const schema = Joi.object<Required<typeof env>>({
    database: Joi.object({
      host: Joi.string().required().label('MYSQL_HOST'),
      port: Joi.number().required().label('MYSQL_PORT'),
      user: Joi.string().required().label('MYSQL_USER'),
      password: Joi.string().required().label('MYSQL_PASSWORD'),
      database: Joi.string().required().label('MYSQL_DATABASE'),
    }),

    app: Joi.object({
      nodeEnv: Joi.string()
        .allow('test', 'development', 'production')
        .required(),
      isTest: Joi.boolean().required(),
      isDevelopment: Joi.boolean().required(),
      isProduction: Joi.boolean().required(),
      isDebug: Joi.boolean().required(),
      port: Joi.number().min(1000).required().label('APP_PORT'),
      cors: cors.label('APP_CORS'),
      adminPassword: Joi.string().required().label('APP_ADMIN_PASSWORD'),
    }),

    ws: Joi.object({
      port: Joi.number().required().label('WS_PORT'),
      cors: cors.label('WS_CORS'),
    }),

    jwt: Joi.object({
      secret: Joi.string().required().label('JWT_SECRET'),
      expiresIn: Joi.string().required().label('JWT_EXPIRES_IN'),
    }),
    
    adminJs: Joi.object({
      enable: Joi.boolean().required().label('ADMINJS_ENABLE'),
      session: Joi.object({
        secret: Joi.string().required().label('ADMINJS_SESSION_SECRET')
      }),
      auth: Joi.object({
        cookieName: Joi.string().required().label('ADMINJS_AUTH_COOKIE_NAME'),
        cookiePassword: Joi.string().required().label('ADMINJS_AUTH_COOKIE_PASSWORD'),
      }),
    })
  });

  const result = schema.validate(env, { abortEarly: false });

  if (result.error) {
    console.error('Invalid environment variables:');
    for (const detail of result.error.details) {
      console.error(' - ' + detail.message);
    }
    process.exit(1);
  }
})();

export { env };
