import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  Repository,
} from 'typeorm';

import {
  InjectRepository,
} from '@nestjs/typeorm';

import { Driver } from './entities/driver.entity';

import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

import { RedisService } from '../redis/redis.service';

@Injectable()
export class DriverService {

  constructor(

    @InjectRepository(Driver)
    private readonly driverRepo: Repository<Driver>,

    private readonly redisService: RedisService,
  ) { }

  async create(
    dto: CreateDriverDto,
  ) {

    const driver =
      this.driverRepo.create(dto);

    return this.driverRepo.save(
      driver,
    );
  }

  async findAll() {
    return this.driverRepo.find();
  }

  async updateLocation(
    dto: UpdateLocationDto,
  ) {

    const driver =
      await this.driverRepo.findOne({
        where: {
          id: dto.driverId,
        },
      });

    if (!driver) {
      throw new NotFoundException(
        'Driver not found',
      );
    }

    const redis =
      this.redisService.getClient();

    await redis.geoAdd(
      'drivers:geo',
      {
        longitude: dto.lng,
        latitude: dto.lat,
        member: dto.driverId,
      },
    );

    return {
      message:
        'Location Updated',
    };
  }

  async getNearbyDrivers(
  lat: number,
  lng: number,
  radius: number = 5,
) {

  const redis =
    this.redisService.getClient();

  const result =
    await redis.sendCommand([
      'GEOSEARCH',
      'drivers:geo',
      'FROMLONLAT',
      lng.toString(),
      lat.toString(),
      'BYRADIUS',
      radius.toString(),
      'km',
      'WITHDIST',
    ]);

  console.log(
    'Redis GEO Result =>',
    result,
  );

  return result.map(
    (item: any) => ({
      member: item[0],
      distance: item[1],
    }),
  );
}
}