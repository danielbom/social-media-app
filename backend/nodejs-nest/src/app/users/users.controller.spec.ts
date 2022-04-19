import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockService } from 'src/tests/mock-service';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  const service = MockService.create<UsersService>(UsersService);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: {} },
      ],
    })
      .overrideProvider(UsersService)
      .useValue(service)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('UsersController.create should only call UsersService.create', async () => {
    const args = [0 as any] as const;
    await controller.create(...args);
    expect(service.create).toBeCalledTimes(1);
    expect(service.create).toBeCalledWith(...args);
  });

  it('UsersController.findAll should only call UsersService.findAll', async () => {
    const args = [] as const;
    await controller.findAll(...args);
    expect(service.findAll).toBeCalledTimes(1);
    expect(service.findAll).toBeCalledWith(...args);
  });

  it('UsersController.findOne should only call UsersService.findOne', async () => {
    const args = [0 as any] as const;
    await controller.findOne(...args);
    expect(service.findOne).toBeCalledTimes(1);
    expect(service.findOne).toBeCalledWith(...args);
  });

  it('UsersController.remove should only call UsersService.remove', async () => {
    const args = [0 as any] as const;
    await controller.remove(...args);
    expect(service.remove).toBeCalledTimes(1);
    expect(service.remove).toBeCalledWith(...args);
  });

  it('UsersController.update should only call UsersService.update', async () => {
    const args = [0 as any, 2 as any] as const;
    await controller.update(...args);
    expect(service.update).toBeCalledTimes(1);
    expect(service.update).toBeCalledWith(...args);
  });
});
