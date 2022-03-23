import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux';

export const useAppDispatch = () => {
  return useDispatch<AppDispatch>();
};
