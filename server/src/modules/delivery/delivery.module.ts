import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delivery } from 'src/modules/delivery/entities/delivery.entity';
import { TripModule } from 'src/modules/trip/trip.module';
import { SettingsModule } from 'src/modules/settings/settings.module';

@Module({
  imports: [TypeOrmModule.forFeature([Delivery]), TripModule, SettingsModule],
  controllers: [DeliveryController],
  providers: [DeliveryService],
})
export class DeliveryModule {}
