import { Comment } from 'src/app/comments/entities/comment.entity';
import { User } from 'src/app/users/entities/user.entity';

export class Post {
  id: string;
  content: string;
  likes: number;

  author: User;
  comments: Comment[];

  createdAt: Date;
  updatedAt: Date;
}
