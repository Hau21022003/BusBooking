import { Bus } from 'src/modules/bus/entities/bus.entity';
import { SeatType } from 'src/modules/bus/enums/seat-type.enum';
import { Route } from 'src/modules/route/entities/route.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  routeId: string;

  @Column()
  busId: string;

  @Column({ type: 'text', array: true })
  departureTimes: string[];

  @Column()
  active: boolean;

  @Column({ type: 'jsonb' })
  prices: Record<SeatType, number>;

  @ManyToOne(() => Bus, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'busId' })
  bus: Bus;

  @ManyToOne(() => Route, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'routeId' })
  route: Route;
}
