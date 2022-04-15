import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Comment } from '../../services/api';
import { logout } from '../thunks/auth';

const commentsAdapter = createEntityAdapter<Comment>();

export const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    entities: commentsAdapter.getInitialState(),
  },
  reducers: {
    addOne(state, action) {
      commentsAdapter.addOne(state.entities, action.payload);
    },
    updateOne(state, action) {
      commentsAdapter.updateOne(state.entities, action.payload);
    },
  },
  extraReducers(builder) {
    builder.addCase(logout.fulfilled, (state, action) => {
      commentsAdapter.removeAll(state.entities);
    });
  },
});

const baseSelectors = commentsAdapter.getSelectors<RootState>(
  state => state.comments.entities,
);

export const selectors = {
  ...baseSelectors,
};
