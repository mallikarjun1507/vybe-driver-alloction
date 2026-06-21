import {
  Module,
  forwardRef,
} from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Ride } from './entities/ride.entity';

import { RideController } from './ride.controller';
import { RideService } from './ride.service';

import { AllocationModule } from '../allocation/allocation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Ride,
    ]),
    forwardRef(
      () => AllocationModule,
    ),
  ],

  controllers: [
    RideController,
  ],

  providers: [
    RideService,
  ],

  exports: [
    RideService,
  ],
})
export class RideModule {}