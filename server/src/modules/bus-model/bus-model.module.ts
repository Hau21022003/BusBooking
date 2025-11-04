import { Module } from '@nestjs/common';
import { BusModelService } from './bus-model.service';
import { BusModelController } from './bus-model.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusModel } from 'src/modules/bus-model/entities/bus-model.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BusModel])],
  controllers: [BusModelController],
  providers: [BusModelService],
  exports: [BusModelService],
})
export class BusModelModule {}
