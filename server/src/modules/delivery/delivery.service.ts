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
    const query = this.deliveryRepository
      .createQueryBuilder('delivery')
      .leftJoinAndSelect('delivery.route', 'route')
      .leftJoinAndSelect('delivery.pickupStation', 'pickupStation')
      .leftJoinAndSelect('delivery.dropoffStation', 'dropoffStation')
      .leftJoinAndSelect('delivery.trip', 'trip');

    if (findAllDto.search) {
      query.andWhere(
        `(delivery.senderName ILIKE :search 
        OR delivery.senderPhone ILIKE :search 
        OR delivery.receiverName ILIKE :search 
        OR delivery.receiverPhone ILIKE :search)`,
        { search: `%${findAllDto.search}%` },
      );
    }

    if (findAllDto.startDate && findAllDto.endDate) {
      const start = new Date(findAllDto.startDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(findAllDto.endDate);
      end.setHours(23, 59, 59, 999);

      query.andWhere('delivery.createdAt BETWEEN :start AND :end', {
        start,
        end,
      });
    } else if (findAllDto.startDate) {
      const start = new Date(findAllDto.startDate);
      start.setHours(0, 0, 0, 0);

      query.andWhere('delivery.createdAt >= :start', { start });
    } else if (findAllDto.endDate) {
      const end = new Date(findAllDto.endDate);
      end.setHours(23, 59, 59, 999);

      query.andWhere('delivery.createdAt <= :end', { end });
    }

    query
      .take(findAllDto.pageSize)
      .skip(findAllDto.offset)
      .orderBy('delivery.updatedAt', 'DESC');

    const [data, total] = await query.getManyAndCount();

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
