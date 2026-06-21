import * as fs from 'fs';
import * as path from 'path';


import {
 DriverService,
} from '../driver/driver.service';

import {
 DriverGateway,
} from '../websocket/driver.gateway';

import { RideService }
  from '../ride/ride.service';

  import { RedisService }
from '../redis/redis.service';

import { RideStatus }
  from '../common/enums/ride-status.enum';

  import {
  InjectQueue,
} from '@nestjs/bullmq';

import {
  Queue,
} from 'bullmq';

import {
  Injectable,
  Inject,
  forwardRef,
} from '@nestjs/common';

@Injectable()
export class AllocationService {

  constructor(

  private readonly driverService:
    DriverService,

  private readonly gateway:
    DriverGateway,

  @Inject(
    forwardRef(
      () => RideService,
    ),
  )
  private readonly rideService:
    RideService,

  private readonly redisService:
    RedisService,

  @InjectQueue(
    'ride-retry',
  )
  private readonly retryQueue:
    Queue,

) {}

 async allocateRide(
  rideId: string,
  lat: number,
  lng: number,
  retryCount = 0,
) {

  try {

    const drivers =
      await this.driverService
        .getNearbyDrivers(
          lat,
          lng,
        );

    console.log(
      'drivers =>',
      drivers,
    );

    console.log(
      'isArray =>',
      Array.isArray(
        drivers,
      ),
    );

    const start =
      retryCount * 5;

    const end =
      start + 5;

    const selectedDrivers =
      (drivers || [])
        .slice(
          start,
          end,
        )
        .map(
          (d: any) =>
            d.member,
        );

    console.log(
      'selectedDrivers =>',
      selectedDrivers,
    );

    await this.retryQueue.add(
  'retry-allocation',
  {
    rideId,
    lat,
    lng,
    retryCount,
  },
  {
    delay: 120000, // 2 minutes
  },
);

    this.gateway.notifyDrivers(
      selectedDrivers,
      rideId,
    );

    return {
      rideId,
      notified:
        selectedDrivers,
    };

  } catch (error) {

    console.error(
      'ALLOCATE RIDE ERROR =>',
      error,
    );

    throw error;
  }
}
  async acceptRide(
  rideId: string,
  driverId: string,
) {

  const redis =
    this.redisService.getClient();

  const ride =
    await this.rideService.getRide(
      rideId,
    );

  if (
    ride.status ===
    RideStatus.TIMEOUT
  ) {
    return {
      success: false,
      message: 'Ride timed out',
    };
  }

  const idempotencyKey =
    `accept:${rideId}:${driverId}`;

  const alreadyAccepted =
    await redis.exists(
      idempotencyKey,
    );

  if (alreadyAccepted) {

    const latestRide =
      await this.rideService.getRide(
        rideId,
      );

    if (
      latestRide.status ===
      RideStatus.ASSIGNED
    ) {
      return {
        success: true,
        message: 'Already Processed',
      };
    }

    await redis.del(
      idempotencyKey,
    );
  }

  const luaScript =
    fs.readFileSync(
      path.join(
        process.cwd(),
        'src',
        'allocation',
        'scripts',
        'assign-driver.lua',
      ),
      'utf8',
    );

  const result =
    await redis.eval(
      luaScript,
      {
        keys: [
          `ride:assignment:${rideId}`,
        ],
        arguments: [
          driverId,
        ],
      },
    );

  if (result === 1) {

    await redis.set(
      idempotencyKey,
      '1',
      {
        EX: 60,
      },
    );

    await this.rideService.assignDriver(
      rideId,
      driverId,
    );

    this.gateway.server.emit(
      'ride-assigned',
      {
        rideId,
        driverId,
      },
    );

    this.gateway.server.emit(
      'ride-closed',
      {
        rideId,
      },
    );

    return {
      success: true,
      message: 'Driver Assigned',
      rideId,
      driverId,
    };
  }

  return {
    success: false,
    message: 'Ride Already Assigned',
  };
}
}