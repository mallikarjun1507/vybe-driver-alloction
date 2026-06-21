

import {
  Repository,
} from 'typeorm';

import {
  InjectRepository,
} from '@nestjs/typeorm';

import { Ride } from './entities/ride.entity';

import { CreateRideDto } from './dto/create-ride.dto';

import { RideStatus } from '../common/enums/ride-status.enum';

import { AllocationService } from '../allocation/allocation.service';

import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';

@Injectable()
export class RideService {

  constructor(

  @InjectRepository(Ride)
  private readonly rideRepo:
    Repository<Ride>,

  @Inject(
    forwardRef(
      () => AllocationService,
    ),
  )
  private readonly allocationService:
    AllocationService,

) {}

  async createRide(
  dto: CreateRideDto,
) {

  const ride =
    this.rideRepo.create({

      riderId: dto.riderId,

      pickupLat: dto.pickupLat,

      pickupLng: dto.pickupLng,

      status: RideStatus.SEARCHING,
    });

  const saved =
    await this.rideRepo.save(
      ride,
    );

  await this.allocationService
    .allocateRide(
      saved.id,
      saved.pickupLat,
      saved.pickupLng,
    );

  return saved;
}

  async getRide(
    rideId: string,
  ) {

    const ride =
      await this.rideRepo.findOne({
        where: {
          id: rideId,
        },
      });

    if (!ride) {
      throw new NotFoundException(
        'Ride not found',
      );
    }

    return ride;
  }

  async getAllRides() {
    return this.rideRepo.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async updateStatus(
    rideId: string,
    status: RideStatus,
  ) {

    const ride =
      await this.getRide(
        rideId,
      );

    ride.status = status;

    return this.rideRepo.save(
      ride,
    );
  }

  async assignDriver(
    rideId: string,
    driverId: string,
  ) {

    const ride =
      await this.getRide(
        rideId,
      );

    ride.assignedDriverId =
      driverId;

    ride.status =
      RideStatus.ASSIGNED;

    return this.rideRepo.save(
      ride,
    );
  }
}