import { Comment } from 'src/entities/comment.entity'
import { Post } from 'src/entities/post.entity'
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  BaseEntity,
} from 'typeorm'
import { Role } from './role.enum'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: Uuid

  @Column({ unique: true })
  username!: string

  @Column({ select: false })
  password?: string

  @Column({ select: false })
  version?: number

  @Column({ type: 'enum', enum: Role })
  role!: Role

  @OneToMany(() => Post, (x) => x.author)
  posts!: Post[]

  @OneToMany(() => Comment, (x) => x.author)
  comments!: Comment[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date | null
}
