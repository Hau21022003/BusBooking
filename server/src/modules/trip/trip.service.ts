import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SeatTrip, Trip } from 'src/modules/trip/entities/trip.entity';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { BusService } from 'src/modules/bus/bus.service';
import { SeatStatus } from 'src/modules/trip/enums/seat-status.enum';
import { SchedulesService } from 'src/modules/schedules/schedule.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FindAllDto } from 'src/modules/trip/dto/find-all.dto';
import { UpdateStatusDto } from 'src/modules/trip/dto/update-status.dto';
import { FindAllPublicDto } from 'src/modules/trip/dto/find-all-public.dto';
import { TripStatus } from 'src/modules/trip/enums/trip-status.enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class TripService {
  private readonly logger = new Logger(TripService.name);

  constructor(
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
    private busService: BusService,
    private scheduleService: SchedulesService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(createTripDto: CreateTripDto) {
    const data = await this.processData(createTripDto);
    return this.tripRepository.save(data);
  }

  async findAll(findAllDto: FindAllDto) {
    const where: any = {};

    if (findAllDto.busId) {
      where.busId = findAllDto.busId;
    }

    if (findAllDto.routeId) {
      where.routeId = findAllDto.routeId;
    }

    if (findAllDto.startDate && findAllDto.endDate) {
      const start = new Date(findAllDto.startDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(findAllDto.endDate);
      end.setHours(23, 59, 59, 999);

      where.departureTime = Between(start, end);
    } else if (findAllDto.startDate) {
      const start = new Date(findAllDto.startDate);
      start.setHours(0, 0, 0, 0);

      where.departureTime = MoreThanOrEqual(start);
    } else if (findAllDto.endDate) {
      const end = new Date(findAllDto.endDate);
      end.setHours(23, 59, 59, 999);

      where.departureTime = LessThanOrEqual(end);
    }

    const [data, total] = await this.tripRepository.findAndCount({
      where,
      order: { departureTime: 'DESC' },
      relations: ['bookings', 'deliveries'],
      skip: findAllDto.offset,
      take: findAllDto.pageSize,
    });

    return {
      data,
      total,
    };
  }

  async findAllPublic(dto: FindAllPublicDto) {
    const date = new Date(dto.date);
    const start = new Date(date.setHours(0, 0, 0, 0));
    const end = new Date(date.setHours(23, 59, 59, 999));

    const where: any = {
      routeId: dto.routeId,
      status: TripStatus.SCHEDULED,
      departureTime: Between(start, end),
      ...(dto.busModelId && { bus: { busModelId: dto.busModelId } }),
    };

    const data = await this.tripRepository.find({
      where,
      order: { departureTime: 'ASC' },
    });

    return data;
  }

  findOne(id: number) {
    return this.tripRepository.findOneByOrFail({ id });
  }

  async updateStatus(id: number, updateStatusDto: UpdateStatusDto) {
    return this.tripRepository.update(id, updateStatusDto);
  }

  remove(id: number) {
    return this.tripRepository.delete({ id });
  }

  async updateSeatStatus({
    seatCol,
    seatRow,
    seatStatus,
    tripId,
  }: {
    tripId: number;
    seatRow: number;
    seatCol: number;
    seatStatus: SeatStatus;
  }) {
    const trip = await this.findOne(tripId);
    const updateSeats = trip.seats.map((seat) =>
      seat.row === seatRow && seat.col === seatCol
        ? { ...seat, status: seatStatus }
        : seat,
    );
    return this.tripRepository.update(tripId, { seats: updateSeats });
  }

  private async processData(dto: CreateTripDto) {
    const bus = await this.busService.findOne(dto.busId);
    const seats: SeatTrip[] = bus.seatLayout.seats.map((seat) => ({
      ...seat,
      status: SeatStatus.AVAILABLE,
    }));
    return {
      seats: seats,
      ...dto,
    };
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async generateTrips() {
    this.logger.log('🚍 Bắt đầu generate trips...');
    const schedules = await this.scheduleService.findActiveSchedules();
    const today = new Date();
    // gen cho hôm nay, ngày mai, ngày mốt
    for (let offset = 0; offset < 3; offset++) {
      const currentDay = new Date(today);
      currentDay.setDate(today.getDate() + offset);

      for (const schedule of schedules) {
        for (const depTime of schedule.departureTimes) {
          const { hour, minute } = depTime;

          const departureDate = new Date(currentDay);
          departureDate.setHours(hour, minute, 0, 0);

          // check đã có trip chưa (tránh trùng lặp)
          const exists = await this.tripRepository.findOne({
            where: {
              routeId: schedule.routeId,
              busId: schedule.busId,
              departureTime: departureDate,
            },
          });
          if (exists) continue;

          const trip: CreateTripDto = {
            routeId: schedule.routeId,
            busId: schedule.busId,
            departureTime: departureDate,
            prices: schedule.prices,
          };

          await this.create(trip);
          this.logger.log(
            `✅ Created trip: route=${schedule.routeId}, bus=${schedule.busId}, time=${departureDate.toISOString()}`,
          );
        }
      }
    }
  }
}
