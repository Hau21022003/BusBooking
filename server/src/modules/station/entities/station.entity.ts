import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Station extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column()
  province: string;

  @Column()
  district: string;

  @Column()
  ward: string;

  @Column({ length: 255, nullable: true })
  address: string;

  @Column({ default: 0, type: 'float' })
  lat: number;

  @Column({ default: 0, type: 'float' })
  lng: number;
}
