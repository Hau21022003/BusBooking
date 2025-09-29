import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { RouteStopType } from 'src/modules/route/enums/route-stop.enum';

class RouteStopDto {
  @IsNumber()
  @IsOptional()
  stationId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(RouteStopType)
  type: RouteStopType;

  @IsOptional()
  @IsInt()
  @Min(0)
  arrivalSeconds?: number;
}

export class CreateRouteDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RouteStopDto)
  stops: RouteStopDto[];
}
