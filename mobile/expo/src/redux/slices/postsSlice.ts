import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { logout } from '../thunks/auth';

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
    entities: postsAdapter.getInitialState(),
  },
  reducers: {
    addOne(state, action) {
      postsAdapter.addOne(state.entities, action.payload);
    },
    updateOne(state, action) {
      postsAdapter.updateOne(state.entities, action.payload);
    },
  },
  extraReducers(builder) {
    builder.addCase(logout.fulfilled, (state, action) => {
      postsAdapter.removeAll(state.entities);
    });
  },
});

const baseSelectors = postsAdapter.getSelectors<RootState>(
  state => state.posts.entities,
);

export const selectors = {
  ...baseSelectors,
};
