import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Driver } from './entities/driver.entity';

import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';

import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Driver,
    ]),
    RedisModule,
  ],

  controllers: [
    DriverController,
  ],

  providers: [
    DriverService,
  ],

  exports: [
    DriverService,
  ],
})
export class DriverModule {}