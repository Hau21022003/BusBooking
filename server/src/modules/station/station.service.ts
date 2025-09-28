import { Injectable } from '@nestjs/common';
import { CreateStationDto } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { Station } from 'src/modules/station/entities/station.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProvinceService } from 'src/modules/province/province.service';

@Injectable()
export class StationService {
  constructor(
    @InjectRepository(Station)
    private stationRepository: Repository<Station>,
    private provinceService: ProvinceService,
  ) {}

  create(createStationDto: CreateStationDto) {
    return this.stationRepository.save(createStationDto);
  }

  async findAll() {
    const items = await this.stationRepository.find({
      order: { createdAt: 'DESC' },
    });
    const result = items.map((item) => {
      const province = this.provinceService.findOneProvince(item.province);
      const district = this.provinceService.findOneDistrict(item.district);
      const ward = this.provinceService.findOneWard(item.ward);
      const fullAddress = `${item.address}, ${ward.name}, ${district.name}, ${province.name}`;
      return { ...item, fullAddress };
    });
    return result;
  }

  findOne(id: number) {
    return this.stationRepository.findOneByOrFail({ id });
  }

  update(id: number, updateStationDto: UpdateStationDto) {
    return this.stationRepository.update(id, updateStationDto);
  }

  remove(id: number) {
    return this.stationRepository.delete({ id });
  }
}
