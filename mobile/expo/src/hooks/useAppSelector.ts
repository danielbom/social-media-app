import { useSelector } from 'react-redux';
import { RootState } from '../redux';

export const useAppSelector = <T>(
  selector: (state: RootState) => T,
  equalifyFn?: (x: T, y: T) => boolean,
) => {
  return useSelector(selector, equalifyFn);
};
