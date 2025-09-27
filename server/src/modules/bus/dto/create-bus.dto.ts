import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { SeatLayoutDto } from 'src/modules/bus/dto/seat-layout.dto';
import { BusType } from 'src/modules/bus/enums/bus-type.enum';

export class CreateBusDto {
  @IsEnum(BusType)
  type: BusType;

  @IsString()
  @IsNotEmpty()
  licensePlate: string;

  @ValidateNested()
  @Type(() => SeatLayoutDto)
  seatLayout: SeatLayoutDto;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;
}
