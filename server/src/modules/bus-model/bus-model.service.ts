import { Injectable } from '@nestjs/common';
import { CreateBusModelDto } from './dto/create-bus-model.dto';
import { UpdateBusModelDto } from './dto/update-bus-model.dto';
import { BusModel } from 'src/modules/bus-model/entities/bus-model.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BusModelService {
  constructor(
    @InjectRepository(BusModel)
    private busModelRepository: Repository<BusModel>,
  ) {}

  create(createBusModelDto: CreateBusModelDto) {
    return this.busModelRepository.save(createBusModelDto);
  }

  findAll() {
    return this.busModelRepository.find();
  }

  findOne(id: number) {
    return this.busModelRepository.findOneByOrFail({ id });
  }

  update(id: number, updateBusModelDto: UpdateBusModelDto) {
    return this.busModelRepository.update(id, updateBusModelDto);
  }

  remove(id: number) {
    return this.busModelRepository.delete({ id });
  }
}
