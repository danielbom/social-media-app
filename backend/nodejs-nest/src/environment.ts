import Joi from 'joi';

const env = {
  database: {
    host: process.env.MYSQL_HOST,
    port: +process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
  app: {
    port: +process.env.APP_PORT,
    cors: process.env.APP_CORS,
  },
};

(function ensureSafeEnvironments() {
  const schema = Joi.object<typeof env>({
    database: Joi.object({
      host: Joi.string().required().label('MYSQL_HOST'),
      port: Joi.number().required().label('MYSQL_PORT'),
      user: Joi.string().required().label('MYSQL_USER'),
      password: Joi.string().required().label('MYSQL_PASSWORD'),
      database: Joi.string().required().label('MYSQL_DATABASE'),
    }),
    app: Joi.object({
      port: Joi.number().min(1000).required().label('APP_PORT'),
      cors: Joi.string()
        .required()
        .regex(/^[^;]+(;[^;]+)*$/, { name: 'list of origins' })
        .label('APP_CORS'),
    }),
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
