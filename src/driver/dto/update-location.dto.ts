import {
  IsNumber,
  IsString,
  IsNotEmpty,
} from 'class-validator';

import {
  ApiProperty,
} from '@nestjs/swagger';

export class UpdateLocationDto {

  @ApiProperty({
    example: '14bd3efb-7173-4e2a-afc3-0622c60f82b9',
    description: 'Unique Driver ID',
  })
  @IsString()
  @IsNotEmpty()
  driverId: string;

  @ApiProperty({
    example: 12.9716,
    description: 'Driver Latitude',
  })
  @IsNumber()
  lat: number;

  @ApiProperty({
    example: 77.5946,
    description: 'Driver Longitude',
  })
  @IsNumber()
  lng: number;
}