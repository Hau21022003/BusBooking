import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsPositive,
  Min,
  ValidateNested,
} from 'class-validator';
import { SeatType } from 'src/modules/bus/enums/seat-type.enum';

export class SeatDto {
  @IsInt()
  @Min(0)
  row: number;

  @IsInt()
  @Min(0)
  col: number;

  @IsEnum(SeatType)
  type: SeatType;
}

export class SeatLayoutDto {
  @IsInt()
  @IsPositive()
  rows: number;

  @IsInt()
  @IsPositive()
  cols: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SeatDto)
  seats: SeatDto[];
}
