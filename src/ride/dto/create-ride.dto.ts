import {
  IsString,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';

import {
  ApiProperty,
} from '@nestjs/swagger';

export class CreateRideDto {

  @ApiProperty({
    example: 'rider-1',
    description: 'Unique Rider ID',
  })
  @IsString()
  @IsNotEmpty()
  riderId: string;

  @ApiProperty({
    example: 12.9716,
    description: 'Pickup Latitude',
  })
  @IsNumber()
  pickupLat: number;

  @ApiProperty({
    example: 77.5946,
    description: 'Pickup Longitude',
  })
  @IsNumber()
  pickupLng: number;
}