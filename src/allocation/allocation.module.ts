import {
  Module,
  forwardRef,
} from '@nestjs/common';

import {
  BullModule,
} from '@nestjs/bullmq';

import {
  AllocationService,
} from './allocation.service';

import {
  DriverModule,
} from '../driver/driver.module';

import {
  RideModule,
} from '../ride/ride.module';

import {
  WebsocketModule,
} from '../websocket/websocket.module';

import {
 RetryProcessor,
}
  from '../jobs/retry.processor';

  import {
  RedisModule,
} from '../redis/redis.module';

@Module({

  imports: [

    BullModule.registerQueue({
      name: 'ride-retry',
    }),

    forwardRef(
      () => RideModule,
    ),

    DriverModule,
 RedisModule,
    WebsocketModule,
  ],

  providers: [
    AllocationService,
    RetryProcessor,
  ],

  

  exports: [
    AllocationService,
  ],

 
})
export class AllocationModule {}