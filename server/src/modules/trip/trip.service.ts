import { Injectable, Logger } from '@nestjs/common';
import { CreateTripDto } from './dto/create-trip.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SeatTrip, Trip } from 'src/modules/trip/entities/trip.entity';
import { Repository } from 'typeorm';
import { BusService } from 'src/modules/bus/bus.service';
import { SeatStatus } from 'src/modules/trip/enums/seat-status.enum';
import { SchedulesService } from 'src/modules/schedules/schedule.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TripService {
  private readonly logger = new Logger(TripService.name);

  constructor(
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
    private busService: BusService,
    private scheduleService: SchedulesService,
  ) {}

  async create(createTripDto: CreateTripDto) {
    const data = await this.processData(createTripDto);
    return this.tripRepository.save(data);
  }

  findAll() {
    return this.tripRepository.find({ order: { createdAt: 'DESC' } });
  }

  findOne(id: number) {
    return this.tripRepository.findOneByOrFail({ id });
  }

  async update(id: number, updateTripDto: CreateTripDto) {
    const data = await this.processData(updateTripDto);
    return this.tripRepository.update(id, data);
  }

  remove(id: number) {
    return this.tripRepository.delete({ id });
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
          // parse giờ phút từ departureTimes (vd: "08:30")
          const [hour, minute] = depTime.split(':').map(Number);

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
