import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { SeatLayoutDto } from 'src/modules/bus-model/dto/seat-layout.dto';

export class CreateBusModelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateNested()
  @Type(() => SeatLayoutDto)
  seatLayout: SeatLayoutDto;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  @IsOptional()
  description: string;
}
