import { Comment } from 'src/entities/comment.entity'
import { User } from 'src/entities/user.entity'
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

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: Uuid

  @Column()
  content!: string

  @Column()
  likes!: number

  @Column()
  authorId!: Uuid

  @ManyToOne(() => User, (x) => x.posts)
  author!: User

  @OneToMany(() => Comment, (x) => x.postParent)
  comments!: Comment[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date | null
}
