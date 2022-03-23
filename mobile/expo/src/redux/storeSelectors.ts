import * as action from './slices/actionSlice';
import * as comments from './slices/commentsSlice';
import * as posts from './slices/postsSlice';
import * as users from './slices/usersSlice';

export const storeSelectors = {
  [posts.postsSlice.name]: posts.selectors,
  [comments.commentsSlice.name]: comments.selectors,
  [users.usersSlice.name]: users.selectors,
  [action.actionSlice.name]: action.selectors,
};
