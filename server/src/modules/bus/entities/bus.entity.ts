import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BusType } from 'src/modules/bus/enums/bus-type.enum';
import { SeatType } from 'src/modules/bus/enums/seat-type.enum';

export class Seat {
  id: string;
  row: number;
  col: number;
  status: 'available' | 'hidden' | 'reserved';
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

  @Column({
    type: 'enum',
    enum: BusType,
  })
  type: BusType;

  @Column({ type: 'jsonb', nullable: true })
  seatLayout: SeatLayout;

  @Column({ unique: true })
  licensePlate: string;

  @Column({ nullable: false })
  imageUrl: string;
}
