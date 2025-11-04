import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SeatType } from 'src/modules/bus/enums/seat-type.enum';
import { BusModel } from 'src/modules/bus-model/entities/bus-model.entity';

export class Seat {
  row: number;
  col: number;
  type: SeatType;
}

export class SeatLayout {
  rows: number;
  cols: number;
  seats: Seat[];
}

@Entity()
export class Bus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb', nullable: true })
  seatLayout: SeatLayout;

  @Column({ unique: true })
  licensePlate: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ nullable: true })
  busModelId?: number;

  @ManyToOne(() => BusModel, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'busModelId' })
  busModel?: BusModel;
}
