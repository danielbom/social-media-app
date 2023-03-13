import { ApiProperty } from '@nestjs/swagger'
import { UserResponse } from 'src/app/users/response/user.response'
import { PageResponse } from 'src/lib/query-filters/swagger/page-response'
import { PostResponse } from './post.response'

export class PostWithAuthorResponse extends PostResponse {
  @ApiProperty({ type: UserResponse })
  author?: UserResponse
}

export class PostsPageResponse extends PageResponse({ type: PostWithAuthorResponse }) {}
