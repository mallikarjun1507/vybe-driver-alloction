import {
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';

import {
  ApiTags,
} from '@nestjs/swagger';

import { DriverService } from './driver.service';

import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@ApiTags('Drivers')
@Controller('drivers')
export class DriverController {

  constructor(
    private readonly driverService: DriverService,
  ) {}

  @Post()
  create(
    @Body()
    dto: CreateDriverDto,
  ) {
    return this.driverService.create(
      dto,
    );
  }

  @Get()
  getAll() {
    return this.driverService.findAll();
  }

  @Post('location')
  updateLocation(
    @Body()
    dto: UpdateLocationDto,
  ) {
    return this.driverService.updateLocation(
      dto,
    );
  }

  @Get('nearby')
  getNearbyDrivers(

    @Query('lat')
    lat: number,

    @Query('lng')
    lng: number,
  ) {
    return this.driverService.getNearbyDrivers(
      Number(lat),
      Number(lng),
    );
  }
}