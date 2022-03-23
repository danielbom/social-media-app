import { configureStore } from '@reduxjs/toolkit';
import { actionUpdate } from './middlewares/actionUpdate';
import { actionSlice } from './slices/actionSlice';
import { commentsSlice } from './slices/commentsSlice';
import { postsSlice } from './slices/postsSlice';
import { usersSlice } from './slices/usersSlice';

export const store = configureStore({
  reducer: {
    [postsSlice.name]: postsSlice.reducer,
    [commentsSlice.name]: commentsSlice.reducer,
    [usersSlice.name]: usersSlice.reducer,
    [actionSlice.name]: actionSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(actionUpdate),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
