import { SeatType } from 'src/modules/bus-model/enums/seat-type.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
export class BusModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  imageUrl: string;

  @Column({ type: 'jsonb' })
  seatLayout: SeatLayout;

  @Column({ nullable: true })
  description?: string;
}
