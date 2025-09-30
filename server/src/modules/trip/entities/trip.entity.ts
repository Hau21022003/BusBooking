import { BaseEntity } from 'src/common/entities/base.entity';
import { Bus } from 'src/modules/bus/entities/bus.entity';
import { SeatType } from 'src/modules/bus/enums/seat-type.enum';
import { Route } from 'src/modules/route/entities/route.entity';
import { SeatStatus } from 'src/modules/trip/enums/seat-status.enum';
import { TripStatus } from 'src/modules/trip/enums/trip-status.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export class SeatTrip {
  row: number;
  col: number;
  status: SeatStatus;
  type: SeatType;
}

@Entity()
export class Trip extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  routeId: string;

  @Column()
  busId: string;

  @Column({ type: 'timestamp' })
  departureTime: Date;

  @Column({
    type: 'enum',
    enum: TripStatus,
    default: TripStatus.SCHEDULED,
  })
  status: TripStatus;

  @Column({ type: 'jsonb' })
  seats: SeatTrip[];

  @Column({ type: 'jsonb' })
  prices: Record<SeatType, number>;

  @ManyToOne(() => Bus, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'busId' })
  bus: Bus;

  @ManyToOne(() => Route, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'routeId' })
  route: Route;
}
