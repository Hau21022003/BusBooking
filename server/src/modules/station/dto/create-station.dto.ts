import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateStationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  province: string;

  @IsString()
  @IsNotEmpty()
  district: string;

  @IsString()
  @IsNotEmpty()
  ward: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  address?: string;
}
