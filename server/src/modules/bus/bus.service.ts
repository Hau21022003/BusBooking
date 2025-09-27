import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBusDto } from 'src/modules/bus/dto/create-bus.dto';
import { UpdateBusDto } from './dto/update-bus.dto';
import { Bus } from 'src/modules/bus/entities/bus.entity';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BusService {
  constructor(
    @InjectRepository(Bus)
    private busRepository: Repository<Bus>,
  ) {}

  async create(createBusDto: CreateBusDto) {
    const existsLicensePlate = await this.busRepository.findOneBy({
      licensePlate: createBusDto.licensePlate,
    });
    if (existsLicensePlate) throw new BadRequestException('Biển số đã tồn tại');
    return this.busRepository.save(createBusDto);
  }

  findAll() {
    return this.busRepository.find();
  }

  findOne(id: string) {
    return this.busRepository.findOneByOrFail({ id });
  }

  async update(id: string, updateBusDto: UpdateBusDto) {
    const existsLicensePlate = await this.busRepository.findOneBy({
      id: Not(id),
      licensePlate: updateBusDto.licensePlate,
    });
    if (existsLicensePlate) throw new BadRequestException('Biển số đã tồn tại');
    return this.busRepository.update(id, updateBusDto);
  }

  remove(id: string) {
    return this.busRepository.delete({ id });
  }
}
