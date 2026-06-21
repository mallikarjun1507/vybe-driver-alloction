import { Module } from '@nestjs/common';

import { DriverGateway }
from './driver.gateway';

@Module({

  providers: [
    DriverGateway,
  ],

  exports: [
    DriverGateway,
  ],
})
export class WebsocketModule {}