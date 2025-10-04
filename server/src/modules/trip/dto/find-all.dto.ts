import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';
import { IsExists } from 'src/common/decorators/is-exists.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Bus } from 'src/modules/bus/entities/bus.entity';
import { Route } from 'src/modules/route/entities/route.entity';

export class FindAllDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  @IsExists(Bus)
  busId?: string;

  @IsOptional()
  @IsUUID()
  @IsExists(Route)
  routeId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
