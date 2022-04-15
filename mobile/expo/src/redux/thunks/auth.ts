import { createAsyncThunk } from '@reduxjs/toolkit';
import { api, AuthLogin } from '../../services/api';

export const login = createAsyncThunk(
  'auth/login',
  async (data: AuthLogin, { rejectWithValue }) => {
    try {
      const response = await api.auth.login(data);
      return response.data;
    } catch (err) {
      rejectWithValue(err);
    }
  },
);

export const register = createAsyncThunk(
  'auth/register',
  async (data: AuthLogin, { rejectWithValue }) => {
    try {
      const response = await api.auth.register(data);
      return response.data;
    } catch (err) {
      rejectWithValue(err);
    }
  },
);

export const logout = createAsyncThunk('auth/logout', async () => {
  api.disableAuthentication();
});
