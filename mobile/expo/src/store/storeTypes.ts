import { storeActions } from './storeActions';

function extractTypes(actionFn: Function): string {
  const action = actionFn();
  return action.type;
}

function createTypes<A>(actions: A): {
  [K1 in keyof A]: { [K2 in keyof A[K1]]: string };
} {
  const anyActions = actions as any;
  const _types: any = {};

  for (const key1 in anyActions) {
    _types[key1] = {};
    for (const key2 in anyActions[key1]) {
      _types[key1][key2] = extractTypes(_types[key1][key2]);
    }
  }

  return anyActions;
}

export const storeTypes = createTypes(storeActions);
