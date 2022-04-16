import { Post } from 'src/app/posts/entities/post.entity';
import { User } from 'src/app/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: Uuid;

  @Column()
  content: string;

  @Column()
  likes: number;

  @OneToOne(() => User, (x) => x.comments)
  author: User;

  @ManyToOne(() => Post, (x) => x.comments)
  postParent: Post;

  @OneToMany(() => Comment, (x) => x.commentParent)
  commentAnswers: Comment[];

  @ManyToOne(() => Comment, (x) => x.commentAnswers)
  commentParent?: Comment;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
