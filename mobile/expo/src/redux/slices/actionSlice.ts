import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

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
  lastAction: undefined as ActionState | undefined,
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

export const selectors = {
  getLastAction(state: RootState): { action?: ActionState; count: number } {
    return {
      count: state.action.count,
      action: state.action.lastAction,
    };
  },
};
