import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { BusModule } from 'src/modules/bus/bus.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from 'src/modules/trip/entities/trip.entity';
import { SchedulesModule } from 'src/modules/schedules/schedules.module';

@Module({
  imports: [TypeOrmModule.forFeature([Trip]), BusModule, SchedulesModule],
  controllers: [TripController],
  providers: [TripService],
})
export class TripModule {}
