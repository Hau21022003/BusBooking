import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { Booking } from 'src/modules/booking/entities/booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripModule } from 'src/modules/trip/trip.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), TripModule],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
