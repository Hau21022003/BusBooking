import { Injectable } from '@nestjs/common';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Delivery } from 'src/modules/delivery/entities/delivery.entity';
import { Repository } from 'typeorm';
import { FindAllDto } from 'src/modules/delivery/dto/find-all.dto';
import { TripService } from 'src/modules/trip/trip.service';
import { SettingsService } from 'src/modules/settings/settings.service';
import { SettingKey } from 'src/modules/settings/enum/setting-key.enum';
import { CalculatePriceDto } from 'src/modules/delivery/dto/calculate-price.dto';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,
    private tripService: TripService,
    private settingsService: SettingsService,
  ) {}

  async create(createDeliveryDto: CreateDeliveryDto, userId: string) {
    const price = await this.calculatePrice({
      tripId: createDeliveryDto.tripId,
      weight: createDeliveryDto.weight,
    });
    return this.deliveryRepository.save({
      ...createDeliveryDto,
      price: price,
      createdBy: { id: userId },
    });
  }

  async findAll(findAllDto: FindAllDto) {
    const [data, total] = await this.deliveryRepository.findAndCount({
      where: {},
      order: { updatedAt: 'DESC' },
      relations: ['bookings'],
      skip: findAllDto.offset,
      take: findAllDto.pageSize,
    });

    return {
      data,
      total,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} delivery`;
  }

  async update(
    id: number,
    updateDeliveryDto: UpdateDeliveryDto,
    userId: string,
  ) {
    const data: any = { ...updateDeliveryDto, updatedBy: { id: userId } };
    if (updateDeliveryDto.weight && updateDeliveryDto.tripId) {
      const price = await this.calculatePrice({
        tripId: updateDeliveryDto.tripId,
        weight: updateDeliveryDto.weight,
      });
      data.price = price;
    }

    return this.deliveryRepository.update(id, data);
  }

  remove(id: number) {
    return this.deliveryRepository.delete(id);
  }

  async calculatePrice(calculatePriceDto: CalculatePriceDto) {
    const trip = await this.tripService.findOne(calculatePriceDto.tripId);
    const basePrice = trip?.route?.deliveryBasePrice || 0;
    let shippingRatePerKg = 0;

    try {
      const rate = await this.settingsService.get(
        SettingKey.SHIPPING_RATE_PER_KG,
      );
      shippingRatePerKg = Number(rate) || 0;
    } catch {}

    const total = basePrice + shippingRatePerKg * calculatePriceDto.weight;

    return Math.ceil(total);
  }
}
