import { BaseEntity } from 'src/common/entities/base.entity';
import { RouteStopType } from 'src/modules/route/enums/route-stop.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Route extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: 0 })
  deliveryBasePrice: number;

  @Column({ type: 'jsonb', nullable: false })
  stops: {
    stationId?: string;
    name: string;
    type: RouteStopType;
    arrivalSeconds?: number;
  }[];
}
