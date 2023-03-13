import { ApiProperty } from '@nestjs/swagger'
import { CommentResponse } from 'src/app/comments/response/comment.response'
import { PostWithAuthorResponse } from './posts-page.response'

export class SinglePostResponse extends PostWithAuthorResponse {
  @ApiProperty({ type: CommentResponse, isArray: true })
  comments?: CommentResponse[]
}
