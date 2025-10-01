import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsExists } from 'src/common/decorators/is-exists.decorator';
import { Bus } from 'src/modules/bus/entities/bus.entity';
import { SeatType } from 'src/modules/bus/enums/seat-type.enum';
import { Route } from 'src/modules/route/entities/route.entity';
import { TripStatus } from 'src/modules/trip/enums/trip-status.enum';

export class CreateTripDto {
  @IsString()
  @IsNotEmpty()
  @IsExists(Route)
  routeId: string;

  @IsString()
  @IsNotEmpty()
  @IsExists(Bus)
  busId: string;

  // @IsDateString()
  // departureTime: string;
  @IsDateString()
  departureTime: Date;

  @IsEnum(TripStatus)
  @IsOptional()
  status?: TripStatus;

  @IsObject()
  prices: Partial<Record<SeatType, number>>;
}
