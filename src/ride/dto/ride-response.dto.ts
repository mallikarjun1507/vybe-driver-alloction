import { ApiProperty } from '@nestjs/swagger';

export class RideResponseDto {

  @ApiProperty()
  id: string;

  @ApiProperty()
  riderId: string;

  @ApiProperty()
  status: string;

  @ApiProperty({
    required: false,
  })
  assignedDriverId?: string;
}