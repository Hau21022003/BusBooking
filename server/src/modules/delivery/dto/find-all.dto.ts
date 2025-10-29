import { IsDateString, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class FindAllDto extends PaginationDto {
  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
