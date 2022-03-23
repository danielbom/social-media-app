import { storeActions } from './storeActions';

type ThunkResult = { pending: string; fulfilled: string; rejected: string };

function extractTypes(actionFn: any): string | ThunkResult {
  if (actionFn.pending) {
    return {
      pending: actionFn.pending.type,
      fulfilled: actionFn.fulfilled.type,
      rejected: actionFn.rejected.type,
    };
  }
  const action = actionFn();
  return action.type;
}

function createTypes<A>(actions: A): {
  [K1 in keyof A]: {
    [K2 in keyof A[K1]]: A[K1][K2] extends { pending: any }
      ? ThunkResult
      : string;
  };
} {
  const anyActions = actions as any;
  const _types: any = {};

  for (const key1 in anyActions) {
    _types[key1] = {};
    for (const key2 in anyActions[key1]) {
      _types[key1][key2] = extractTypes(anyActions[key1][key2]);
    }
  }

  return _types;
}

export const storeTypes = createTypes(storeActions);
