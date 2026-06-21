import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

import { DriverStatus } from '../../common/enums/driver-status.enum';

@Entity('drivers')
export class Driver {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    unique: true,
  })
  phone: string;

  @Column({
    type: 'enum',
    enum: DriverStatus,
    default: DriverStatus.AVAILABLE,
  })
  status: DriverStatus;

  @CreateDateColumn()
  createdAt: Date;
}