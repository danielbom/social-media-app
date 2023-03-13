import { PageResponse } from 'src/lib/query-filters/swagger/page-response'
import { UserResponse } from './user.response'

export class UsersPageResponse extends PageResponse({ type: UserResponse }) {}
