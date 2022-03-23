import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Comment } from '../../services/api';

const commentsAdapter = createEntityAdapter<Comment>();

export const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: commentsAdapter.getInitialState(),
  },
  reducers: {
    addOne(state, action) {
      commentsAdapter.addOne(state.comments, action.payload);
    },
    updateOne(state, action) {
      commentsAdapter.updateOne(state.comments, action.payload);
    },
  },
});

const baseSelectors = commentsAdapter.getSelectors<RootState>(state => state.comments.comments);

export const selectors = {
  ...baseSelectors,
};
