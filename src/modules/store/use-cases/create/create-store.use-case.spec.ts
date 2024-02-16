import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/common/database/prisma/prisma.service';
import { createStoreDtoMock, storeMock, userMock } from 'src/__mocks__';
import { CreateStoreUseCase } from './create-store.use-case';
import { storeModuleMock } from '../../store.module';

describe('CreateUserUseCase', () => {
  let useCase: CreateStoreUseCase;
  let moduleRef: TestingModule;
  let prismaService: PrismaService;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule(storeModuleMock).compile();

    prismaService = moduleRef.get<PrismaService>(PrismaService);
    useCase = moduleRef.get<CreateStoreUseCase>(CreateStoreUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  afterEach(async () => {
    prismaService.$disconnect();

    await moduleRef.close();
  });

  it('should be create', async () => {
    jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(userMock);

    const create = jest
      .spyOn(prismaService.store, 'create')
      .mockResolvedValue(storeMock);

    const response = await useCase.execute(createStoreDtoMock);

    expect(response).toStrictEqual(storeMock);
    expect(create).toHaveBeenCalledWith({
      data: {
        ...createStoreDtoMock,
        deletedAt: null,
      },
    });
  });
});
