import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsString,
  Matches,
} from 'class-validator';
import { IsExists } from 'src/common/decorators/is-exists.decorator';
import { Bus } from 'src/modules/bus/entities/bus.entity';
import { SeatType } from 'src/modules/bus/enums/seat-type.enum';
import { Route } from 'src/modules/route/entities/route.entity';

export class CreateScheduleDto {
  @IsString()
  @IsNotEmpty()
  @IsExists(Route)
  routeId: string;

  @IsString()
  @IsNotEmpty()
  @IsExists(Bus)
  busId: string;

  @IsArray()
  @IsString({ each: true })
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
    each: true,
    message: 'Invalid time format, expected HH:mm',
  })
  departureTimes: string[];

  @IsObject()
  prices: Record<SeatType, number>;

  @IsBoolean()
  active: boolean;
}
