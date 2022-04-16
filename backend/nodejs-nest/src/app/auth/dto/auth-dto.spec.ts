import { AuthLoginDto } from './auth-login.dto';
import { AuthRegisterDto } from './auth-register.dto';
import { TestSchema } from 'src/tests/test-schema';

describe('Auth DTO', () => {
  describe('AuthLoginDto', () => {
    const testSchema = TestSchema.fromClass(AuthLoginDto);
    it('should works with valid data', () => {
      testSchema.mustWorks({
        username: '123',
        password: '12345678',
      });
    });

    it('should fail with invalid data', () => {
      testSchema.mustFail({});
      testSchema.mustFail({ password: '' });
      testSchema.mustFail({ username: '' });
      testSchema.mustFail({ username: '', password: '' });
      testSchema.mustFail({ username: '12', password: '12345678' });
    });
  });

  describe('AuthRegisterDto', () => {
    const testSchema = TestSchema.fromClass(AuthRegisterDto);
    it('should works with valid data', () => {
      testSchema.mustWorks({
        username: '123',
        password: '12345678',
      });
    });
    it('should fail with invalid data', () => {
      testSchema.mustFail({});
      testSchema.mustFail({ password: '' });
      testSchema.mustFail({ username: '' });
      testSchema.mustFail({ username: '', password: '' });
      testSchema.mustFail({ username: '12', password: '12345678' });
    });
  });
});
