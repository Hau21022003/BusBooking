import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

export enum Role {
  ADMIN = 'ADMIN',
  STATION_STAFF = 'STATION_STAFF',
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ type: 'enum', enum: Role, default: Role.STATION_STAFF })
  role: Role;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  @Exclude()
  refreshToken: string;
}
