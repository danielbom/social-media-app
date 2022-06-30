import { Comment } from 'src/app/comments/entities/comment.entity';
import { User } from 'src/app/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: Uuid;

  @Column()
  content: string;

  @Column()
  likes: number;

  @Column()
  authorId: Uuid;

  @ManyToOne(() => User, (x) => x.posts)
  author: User;

  @OneToMany(() => Comment, (x) => x.postParent)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
