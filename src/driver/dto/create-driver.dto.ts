import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

import {
  ApiProperty,
} from '@nestjs/swagger';

export class CreateDriverDto {

  @ApiProperty({
    example: 'Driver 1',
    description: 'Driver full name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '9999999999',
    description: 'Driver phone number',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;
}