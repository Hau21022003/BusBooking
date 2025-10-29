import { Injectable } from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Delivery } from 'src/modules/delivery/entities/delivery.entity';
import { Repository } from 'typeorm';
import { FindAllDto } from 'src/modules/delivery/dto/find-all.dto';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,
  ) {}

  create(createDeliveryDto: CreateDeliveryDto, userId: string) {
    return this.deliveryRepository.save({
      ...createDeliveryDto,
      createdBy: { id: userId },
    });
  }

  async findAll(findAllDto: FindAllDto) {
    const [data, total] = await this.deliveryRepository.findAndCount({
      where: {},
      order: { updatedAt: 'DESC' },
      relations: ['bookings'],
      skip: findAllDto.offset,
      take: findAllDto.pageSize,
    });

    return {
      data,
      total,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} delivery`;
  }

  update(id: number, updateDeliveryDto: UpdateDeliveryDto, userId: string) {
    return this.deliveryRepository.update(id, {
      ...updateDeliveryDto,
      updatedBy: { id: userId },
    });
  }

  remove(id: number) {
    return this.deliveryRepository.delete(id);
  }
}
