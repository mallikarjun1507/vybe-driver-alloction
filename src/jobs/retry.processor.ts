import {
  Processor,
  WorkerHost,
} from '@nestjs/bullmq';

import { Job } from 'bullmq';

import { AllocationService }
from '../allocation/allocation.service';

import { RideService }
from '../ride/ride.service';

import { RideStatus }
from '../common/enums/ride-status.enum';

@Processor('ride-retry')
export class RetryProcessor
  extends WorkerHost {

  constructor(
    private readonly allocationService:
      AllocationService,

    private readonly rideService:
      RideService,
  ) {
    super();
  }

  async process(
    job: Job,
  ) {

    const {
      rideId,
      lat,
      lng,
      retryCount,
    } = job.data;

    const ride =
      await this.rideService.getRide(
        rideId,
      );

    if (
      ride.status ===
      RideStatus.ASSIGNED
    ) {
      return;
    }

    if (retryCount >= 3) {

      await this.rideService
        .updateStatus(
          rideId,
          RideStatus.TIMEOUT,
        );

      return;
    }

    await this.allocationService
      .allocateRide(
        rideId,
        lat,
        lng,
        retryCount + 1,
      );
  }
}