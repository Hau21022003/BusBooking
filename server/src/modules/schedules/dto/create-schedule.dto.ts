import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsString,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { IsExists } from 'src/common/decorators/is-exists.decorator';
import { Bus } from 'src/modules/bus/entities/bus.entity';
import { SeatType } from 'src/modules/bus/enums/seat-type.enum';
import { Route } from 'src/modules/route/entities/route.entity';

class DepartureTimeDto {
  @IsInt()
  @Min(0)
  @Max(23)
  hour: number;

  @IsInt()
  @Min(0)
  @Max(59)
  minute: number;
}

export class CreateScheduleDto {
  @IsString()
  @IsNotEmpty()
  @IsExists(Route)
  routeId: string;

  @IsString()
  @IsNotEmpty()
  @IsExists(Bus)
  busId: string;

  // @IsArray()
  // @IsString({ each: true })
  // @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
  //   each: true,
  //   message: 'Invalid time format, expected HH:mm',
  // })
  // departureTimes: string[];
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DepartureTimeDto)
  departureTimes: DepartureTimeDto[];

  @IsObject()
  prices: Partial<Record<SeatType, number>>;

  @IsBoolean()
  active: boolean;
}
