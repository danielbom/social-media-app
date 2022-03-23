import { useEffect, useRef } from 'react';
import { useStore } from 'react-redux';
import { RootState } from '../redux';

// https://www.youtube.com/watch?v=MrUzA-x3oBc&ab_channel=Codeminer42

export const useSideEffect = (
  sideEffect: () => any,
  typeList: Array<String>,
) => {
  const currentCount = useRef(-1);
  const store = useStore();

  useEffect(() => {
    return store.subscribe(() => {
      const state: RootState = store.getState();
      const lastType = state.action.lastAction?.type!;

      const previousCount = currentCount.current;
      const nextCount = state.action.count;
      currentCount.current = nextCount;

      if (previousCount !== nextCount && typeList.includes(lastType)) {
        sideEffect();
      }
    });
  }, [store, sideEffect, typeList]);
};
