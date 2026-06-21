import {
  Controller,
  Post,
  Body,
  Get,
  Param,
} from '@nestjs/common';

import {
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';

import { RideService } from './ride.service';

import { CreateRideDto } from './dto/create-ride.dto';

import { AcceptRideDto } from './dto/accept-ride.dto';

import { RideResponseDto } from './dto/ride-response.dto';

import { AllocationService } from '../allocation/allocation.service';

@ApiTags('Rides')
@Controller('rides')
export class RideController {

  constructor(
    private readonly rideService: RideService,

    private readonly allocationService:
      AllocationService,
  ) {}

  @ApiResponse({
    status: 201,
    description: 'Ride Created Successfully',
    type: RideResponseDto,
  })
  @Post()
  createRide(
    @Body()
    dto: CreateRideDto,
  ) {
    return this.rideService.createRide(
      dto,
    );
  }

  @ApiResponse({
    status: 200,
    description: 'All Rides',
    type: [RideResponseDto],
  })
  @Get()
  getAll() {
    return this.rideService.getAllRides();
  }

  @ApiResponse({
    status: 200,
    description: 'Ride Found',
    type: RideResponseDto,
  })
  @Get(':id')
  getRide(
    @Param('id')
    id: string,
  ) {
    return this.rideService.getRide(
      id,
    );
  }

  @ApiResponse({
    status: 200,
    description: 'Driver Acceptance Result',
  })
  @Post('accept')
  acceptRide(
    @Body()
    dto: AcceptRideDto,
  ) {
    return this.allocationService.acceptRide(
      dto.rideId,
      dto.driverId,
    );
  }
}