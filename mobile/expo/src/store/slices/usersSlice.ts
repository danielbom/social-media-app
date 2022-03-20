import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

type User = {
  id: string;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

const usersAdapter = createEntityAdapter<User>();

export const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: usersAdapter.getInitialState(),
  },
  reducers: {},
});
