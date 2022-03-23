import { Middleware } from '@reduxjs/toolkit';
import { actionSlice } from '../slices/actionSlice';

export const actionUpdate: Middleware = ({ dispatch }) => {
  const { type: updateActionType } = actionSlice.actions.update(null as any);

  return next => action => {
    if (action.type !== updateActionType) {
      dispatch(actionSlice.actions.update(action));
    }
    return next(action);
  };
};
