import { MethodNotAllowedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UnreachableException } from 'src/exceptions/unreachable.exception';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

describe('CommentsController', () => {
  let controller: CommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [CommentsService],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('CommentsController.remove', () => {
    it('should fail ever', async () => {
      try {
        await controller.remove('');
        throw new UnreachableException();
      } catch (error) {
        expect(error).toBeInstanceOf(MethodNotAllowedException);
      }
    });
  });
});
