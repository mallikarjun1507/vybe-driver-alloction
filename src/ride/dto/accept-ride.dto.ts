import {
 IsString,
} from 'class-validator';

import {
 ApiProperty,
} from '@nestjs/swagger';

export class AcceptRideDto {

 @ApiProperty()
 @IsString()
 rideId: string;

 @ApiProperty()
 @IsString()
 driverId: string;
}