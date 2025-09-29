import { Injectable } from '@nestjs/common';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { Route } from 'src/modules/route/entities/route.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(Route)
    private routeRepository: Repository<Route>,
  ) {}

  create(createRouteDto: CreateRouteDto) {
    return this.routeRepository.save(createRouteDto);
  }

  findAll() {
    return this.routeRepository.find({ order: { createdAt: 'DESC' } });
  }

  findOne(id: number) {
    return `This action returns a #${id} route`;
  }

  update(id: string, updateRouteDto: UpdateRouteDto) {
    return this.routeRepository.update(id, updateRouteDto);
  }

  remove(id: string) {
    return this.routeRepository.delete({ id });
  }
}
