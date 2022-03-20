import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

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
