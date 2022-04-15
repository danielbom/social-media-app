import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { User } from '../../services/api';
import { login, logout } from '../thunks/auth';

const usersAdapter = createEntityAdapter<User>();

export const usersSlice = createSlice({
  name: 'users',
  initialState: {
    entities: usersAdapter.getInitialState(),
    currentUser: null as string | null,
  },
  reducers: {},
  extraReducers(builder) {
    builder.addCase(login.fulfilled, (state, action) => {
      if (action.payload) {
        usersAdapter.addOne(state.entities, action.payload.user);
        state.currentUser = action.payload.user.id;
      }
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.currentUser = null;
      usersAdapter.removeAll(state.entities);
    });
  },
});

const baseSelectors = usersAdapter.getSelectors<RootState>(
  state => state.users.entities,
);

export const selectors = {
  ...baseSelectors,
  getCurrentUser(state: RootState): User | undefined {
    if (state.users.currentUser) {
      return baseSelectors.selectById(state, state.users.currentUser);
    }
  },
};
