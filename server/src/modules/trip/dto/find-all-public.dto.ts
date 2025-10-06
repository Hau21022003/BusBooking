import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { IsExists } from 'src/common/decorators/is-exists.decorator';
import { BusType } from 'src/modules/bus/enums/bus-type.enum';
import { Route } from 'src/modules/route/entities/route.entity';

export class FindAllPublicDto {
  @IsDateString()
  date: string;

  @IsUUID()
  @IsExists(Route)
  routeId: string;

  @IsOptional()
  @IsEnum(BusType)
  busType?: BusType;
}
