import { Module } from '@nestjs/common';
import { StationService } from './station.service';
import { StationController } from './station.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Station } from 'src/modules/station/entities/station.entity';
import { ProvinceModule } from 'src/modules/province/province.module';

@Module({
  imports: [TypeOrmModule.forFeature([Station]), ProvinceModule],
  controllers: [StationController],
  providers: [StationService],
})
export class StationModule {}
