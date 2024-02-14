import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { storeMock } from 'src/__mocks__';
import { HttpException } from '@nestjs/common';
import { FindByIdStoreUseCase } from './find-by-id-store.use-case';
import { storeModuleMock } from '../../store.module';

describe('FindByIdStoreUseCase', () => {
  let useCase: FindByIdStoreUseCase;
  let moduleRef: TestingModule;
  let prismaService: PrismaService;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule(storeModuleMock).compile();

    prismaService = moduleRef.get<PrismaService>(PrismaService);
    useCase = moduleRef.get<FindByIdStoreUseCase>(FindByIdStoreUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  afterEach(async () => {
    prismaService.$disconnect();

    await moduleRef.close();
  });

  it('should be find by id', async () => {
    const findFirst = jest
      .spyOn(prismaService.store, 'findFirst')
      .mockResolvedValue(storeMock);

    const response = await useCase.execute('1');

    expect(response).toStrictEqual(storeMock);
    expect(findFirst).toHaveBeenCalledWith({
      where: {
        id: '1',
        deletedAt: null,
      },
    });
  });

  it('Should throw an error when not found store', async () => {
    jest.spyOn(prismaService.store, 'findFirst').mockResolvedValue(null);

    const spyFind = jest.spyOn(useCase, 'execute');

    await expect(useCase.execute('1')).rejects.toThrow(HttpException);

    expect(spyFind).toHaveBeenCalledTimes(1);
  });
});
