import { PageResponse } from 'src/lib/query-filters/swagger/page-response'
import { CommentRelatedResponse } from './comment-related.response'

export class CommentsPageResponse extends PageResponse({ type: CommentRelatedResponse }) {}
