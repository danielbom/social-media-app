import { createSlice } from '@reduxjs/toolkit';

type ActionState =
  | {
      type: string;
      payload: any;
    }
  | {
      type: string;
      error: any;
    };

const initialState = {
  lastAction: null as ActionState | null,
  count: 0,
};

export const actionSlice = createSlice({
  name: 'action',
  initialState,
  reducers: {
    update(state, action) {
      state.lastAction = action.payload;
      state.count += 1;
    },
  },
});
