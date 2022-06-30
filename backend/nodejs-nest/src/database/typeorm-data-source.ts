import path from 'path';
import { Comment } from 'src/entities/comment.entity';
import { Post } from 'src/entities/post.entity';
import { User } from 'src/entities/user.entity';
import { env } from 'src/environment';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const dataSource = new DataSource({
  type: 'mysql',
  host: env.database.host,
  port: env.database.port,
  username: env.database.user,
  password: env.database.password,
  database: env.database.database,
  entities: [User, Comment, Post],
  migrations: [path.resolve(__dirname, 'migrations', '*.ts')],
  namingStrategy: new SnakeNamingStrategy(),
  // synchronize: true, // run new migrations
  // logging: true, // show sql
});

export default dataSource;
