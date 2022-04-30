import { TestSchema } from 'src/tests/test-schema';
import { Role } from '../entities/role.enum';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';

describe('Auth DTO', () => {
  describe('AuthLoginDto', () => {
    const testSchema = TestSchema.fromClass(CreateUserDto);
    it('should works with valid data', () => {
      const withRole = (role: Role) => ({
        username: '123',
        password: '12345678',
        role,
      });
      testSchema.mustWorks(withRole(Role.ADMIN));
      testSchema.mustWorks(withRole(Role.USER));
    });

    it('should fail with invalid data', () => {
      testSchema.mustFail({});
      testSchema.mustFail({ password: '' });
      testSchema.mustFail({ username: '' });
      testSchema.mustFail({ username: '', password: '' });
      testSchema.mustFail({ username: '', password: '', role: '' });
      testSchema.mustFail({ username: '12', password: '12345678', role: '' });
      testSchema.mustFail({ username: '123', password: '12345678', role: '' });
      testSchema.mustFail({
        username: '123',
        password: '12345678',
        role: 'unknown',
      });
    });
  });

  describe('AuthRegisterDto', () => {
    const testSchema = TestSchema.fromClass(UpdateUserDto);
    it('should works with valid data', () => {
      testSchema.mustWorks({
        username: '123',
      });
      testSchema.mustWorks({
        username: '123',
        password: '12345678',
      });
      testSchema.mustWorks({
        username: '123',
        password: '12345678',
        role: Role.USER,
      });
    });
    it('should fail with invalid data', () => {
      testSchema.mustFail(null);
      testSchema.mustFail({ role: 'unknown' });
    });
  });
});
