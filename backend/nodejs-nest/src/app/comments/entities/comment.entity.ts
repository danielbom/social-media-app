import { Post } from 'src/app/posts/entities/post.entity';
import { User } from 'src/app/users/entities/user.entity';

export class Comment {
  id: Uuid;
  content: string;
  likes: number;

  author: User;
  postParent: Post;
  commentAnswers: Comment[];
  commentParent?: Comment;

  createdAt: Date;
  updatedAt: Date;
}
