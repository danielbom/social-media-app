import path from 'path';
import { Comment } from 'src/app/comments/entities/comment.entity';
import { Post } from 'src/app/posts/entities/post.entity';
import { User } from 'src/app/users/entities/user.entity';

import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const dataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'admin',
  password: '123mudar',
  database: 'test',
  entities: [User, Comment, Post],
  migrations: [path.resolve(__dirname, 'migrations', '*.ts')],
  namingStrategy: new SnakeNamingStrategy(),
  // synchronize: true,
});

export default dataSource;
