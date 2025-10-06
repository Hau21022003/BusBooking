import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IsExists } from 'src/common/decorators/is-exists.decorator';
import { Trip } from 'src/modules/trip/entities/trip.entity';

class SeatDto {
  @IsNumber()
  row: number;

  @IsNumber()
  col: number;
}

export class CreateBookingPublicDto {
  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  pickupLocation: string;

  @IsNumber()
  @IsExists(Trip)
  tripId: number;

  @ValidateNested()
  @Type(() => SeatDto)
  seat: SeatDto;
}
