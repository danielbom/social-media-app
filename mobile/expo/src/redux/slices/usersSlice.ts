import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { User } from '../../services/api';
import { login } from '../thunks/auth';

const usersAdapter = createEntityAdapter<User>();

export const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: usersAdapter.getInitialState(),
    currentUser: null as string | null
  },
  reducers: {},
  extraReducers(builder) {
    builder.addCase(login.fulfilled, (state, action) => {
      if (action.payload) {
        usersAdapter.addOne(state.users, action.payload.user);
        state.currentUser = action.payload.user.id;
      }
    });
  }
});

const baseSelectors = usersAdapter.getSelectors<RootState>(state => state.users.users);

export const selectors = {
  ...baseSelectors,
  getCurrentUser(state: RootState): User | undefined {
    if (state.users.currentUser) {
      return baseSelectors.selectById(state, state.users.currentUser);
    }
  }
};
