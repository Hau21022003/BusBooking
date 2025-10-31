import { BaseEntity } from 'src/common/entities/base.entity';
import { Route } from 'src/modules/route/entities/route.entity';
import { Station } from 'src/modules/station/entities/station.entity';
import { Trip } from 'src/modules/trip/entities/trip.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum DeliveryStatus {
  PENDING = 'PENDING',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
}

@Entity()
export class Delivery extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  senderName: string;

  @Column()
  senderPhone: string;

  @Column()
  receiverName: string;

  @Column()
  receiverPhone: string;

  @Column({ nullable: true })
  @Index()
  routeId?: string;

  @ManyToOne(() => Route, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'routeId' })
  route?: Route;

  @ManyToOne(() => Station, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'pickupStationId' })
  pickupStation: Station;

  @Column({ nullable: true })
  @Index()
  pickupStationId?: number;

  @ManyToOne(() => Station, { eager: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'dropoffStationId' })
  dropoffStation: Station;

  @Column({ nullable: true })
  @Index()
  dropoffStationId: number;

  @Column({ type: 'float' })
  weight: number;

  @Column({ nullable: true })
  description?: string;

  @Column()
  @Index()
  tripId: number;

  @ManyToOne(() => Trip, (trip) => trip.deliveries, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tripId' })
  trip: Trip;

  @Column({
    type: 'enum',
    enum: DeliveryStatus,
    default: DeliveryStatus.PENDING,
  })
  status: DeliveryStatus;

  @Column({ type: 'float', default: 0 })
  price: number;
}
