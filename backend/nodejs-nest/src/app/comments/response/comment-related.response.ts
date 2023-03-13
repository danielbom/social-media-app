import { ApiProperty } from '@nestjs/swagger'
import { UserResponse } from 'src/app/users/response/user.response'
import { CommentResponse } from './comment.response'

export class CommentWithAuthor extends CommentResponse {
  @ApiProperty({ type: UserResponse, required: false })
  author?: UserResponse
}

export class CommentRelatedResponse extends CommentWithAuthor {
  @ApiProperty({ type: CommentWithAuthor, isArray: true, required: false })
  commentAnswers?: CommentWithAuthor[]
}
