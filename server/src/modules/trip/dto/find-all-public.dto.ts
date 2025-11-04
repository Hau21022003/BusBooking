import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { IsExists } from 'src/common/decorators/is-exists.decorator';
import { BusModel } from 'src/modules/bus-model/entities/bus-model.entity';
import { Route } from 'src/modules/route/entities/route.entity';

export class FindAllPublicDto {
  @IsDateString()
  date: string;

  @IsUUID()
  @IsExists(Route)
  routeId: string;

  @IsOptional()
  @IsNumber()
  @IsExists(BusModel)
  busModelId?: number;
}
