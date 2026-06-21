import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';

import { BullModule } from '@nestjs/bullmq';

import { DriverModule } from './driver/driver.module';
import { RideModule } from './ride/ride.module';

import { RedisModule } from './redis/redis.module';
import { WebsocketModule } from './websocket/websocket.module';
import { HealthModule } from './health/health.module';

import * as Joi from 'joi';

@Module({
  imports: [

    ConfigModule.forRoot({

      isGlobal: true,

      validationSchema: Joi.object({

        PORT: Joi.number()
          .required(),

        DB_HOST: Joi.string()
          .required(),

        DB_PORT: Joi.number()
          .required(),

        DB_USERNAME: Joi.string()
          .required(),

        DB_PASSWORD: Joi.string()
          .required(),

        DB_NAME: Joi.string()
          .required(),

        REDIS_HOST: Joi.string()
          .required(),

        REDIS_PORT: Joi.number()
          .required(),
      }),
    }),

    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',

        host: process.env.DB_HOST,

        port: Number(
          process.env.DB_PORT,
        ),

        username:
          process.env.DB_USERNAME,

        password:
          process.env.DB_PASSWORD,

        database:
          process.env.DB_NAME,

        autoLoadEntities: true,

        synchronize: true,
      }),
    }),

    BullModule.forRoot({

      connection: {
        host:
          process.env.REDIS_HOST,

        port:
          Number(
            process.env.REDIS_PORT,
          ),
      },

    }),

    DriverModule,

    RideModule,

    RedisModule,

    WebsocketModule,

    HealthModule,

  ],
})
export class AppModule {}