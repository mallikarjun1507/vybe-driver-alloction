import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

import { RideStatus } from '../../common/enums/ride-status.enum';

@Entity('rides')
export class Ride {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  riderId: string;

  @Column({
    type: 'double precision',
  })
  pickupLat: number;

  @Column({
    type: 'double precision',
  })
  pickupLng: number;

  @Column({
    type: 'enum',
    enum: RideStatus,
    default: RideStatus.REQUESTED,
  })
  status: RideStatus;

  @Column({
    nullable: true,
  })
  assignedDriverId: string;

  @CreateDateColumn()
  createdAt: Date;
}