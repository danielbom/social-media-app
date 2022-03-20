import { actionSlice } from './slices/actionSlice';
import { commentsSlice } from './slices/commentsSlice';
import { postsSlice } from './slices/postsSlice';
import { usersSlice } from './slices/usersSlice';

export const storeActions = {
  [postsSlice.name]: postsSlice.actions,
  [commentsSlice.name]: commentsSlice.actions,
  [usersSlice.name]: usersSlice.actions,
  [actionSlice.name]: actionSlice.actions,
};
