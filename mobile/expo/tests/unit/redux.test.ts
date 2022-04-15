import { store } from '../../src/redux';
import { api } from '../../src/services/api';
import { api as fakeApi } from '../../src/services/api/fake';

Object.assign(api, fakeApi);

describe('', () => {
  it('should 2 to be equals 2', () => {
    expect(2).toEqual(2);
  });
});
