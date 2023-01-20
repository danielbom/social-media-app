import { Post } from 'src/entities/post.entity'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from './user.entity'

@Entity()
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: Uuid

  @Column()
  content: string

  @Column()
  likes: number

  @Column()
  authorId: Uuid

  @ManyToOne(() => User, (x) => x.comments)
  author: User

  @Column()
  postParentId: Uuid

  @ManyToOne(() => Post, (x) => x.comments)
  postParent: Post

  @OneToMany(() => Comment, (x) => x.commentParent)
  commentAnswers: Comment[]

  @ManyToOne(() => Comment, (x) => x.commentAnswers)
  commentParent?: Comment

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date | null
}
