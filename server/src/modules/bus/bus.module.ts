import { Module } from '@nestjs/common';
import { BusService } from './bus.service';
import { BusController } from './bus.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bus } from 'src/modules/bus/entities/bus.entity';
import { BusModelModule } from 'src/modules/bus-model/bus-model.module';

@Module({
  imports: [TypeOrmModule.forFeature([Bus]), BusModelModule],
  controllers: [BusController],
  providers: [BusService],
  exports: [BusService],
})
export class BusModule {}
