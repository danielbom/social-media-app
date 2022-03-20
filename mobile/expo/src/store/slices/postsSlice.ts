import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

type Post = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

const postsAdapter = createEntityAdapter<Post>();

export const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: postsAdapter.getInitialState(),
  },
  reducers: {
    addOne(state, action) {
      postsAdapter.addOne(state.posts, action.payload);
    },
    updateOne(state, action) {
      postsAdapter.updateOne(state.posts, action.payload);
    },
  },
});
