import { Injectable } from '@nestjs/common';
import { UseCaseBase } from 'src/domain/base';
import { CreateStoreDto } from 'src/domain/dtos';
import { StoreEntity } from 'src/domain/entities';
import { FindByIdUserUseCase } from 'src/modules/user/use-cases';
import { StoreRepository } from '../../store.repository';
import { CreatePageUseCase } from 'src/modules/page/use-cases';

@Injectable()
export class CreateStoreUseCase
  implements UseCaseBase<CreateStoreDto, StoreEntity>
{
  constructor(
    private readonly findByIdUserUseCase: FindByIdUserUseCase,
    private readonly storeRepository: StoreRepository,
    private readonly createPageUseCase: CreatePageUseCase,
  ) {}

  async execute(data: CreateStoreDto): Promise<StoreEntity> {
    const user = await this.findByIdUserUseCase.execute(data.userId);

    const store = await this.storeRepository.create({
      ...data,
      userId: user.id,
    });

    await this.createPageUseCase.execute({ storeId: store.id });

    return store;
  }
}
