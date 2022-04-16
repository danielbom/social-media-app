import { Injectable, MethodNotAllowedException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  async create(createPostDto: CreatePostDto): Promise<Post> {
    return {} as any;
  }

  async findAll(): Promise<Post[]> {
    return [];
  }

  async findOne(id: Uuid): Promise<Post> {
    return {} as any;
  }

  async update(id: Uuid, updatePostDto: UpdatePostDto): Promise<Post> {
    return {} as any;
  }

  async remove(id: Uuid): Promise<void> {
    throw new MethodNotAllowedException();
  }
}
