import { BaseEntity } from 'src/common/entities/base.entity';
import { BookingStatus } from 'src/modules/booking/enums/booking-status.enum';
import { PaymentStatus } from 'src/modules/booking/enums/payment-status.enum';
import { Trip } from 'src/modules/trip/entities/trip.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Booking extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  pickupLocation?: string;

  @Index()
  @Column()
  tripId: number;

  @Column({ type: 'jsonb' })
  seat: {
    row: number;
    col: number;
  };

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.RESERVED,
  })
  bookingStatus: BookingStatus;

  @Column()
  price: number;

  @ManyToOne(() => Trip, (trip) => trip.bookings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tripId' })
  trip: Trip;
}
