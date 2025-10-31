import { IsNumber, Min } from 'class-validator';
import { IsExists } from 'src/common/decorators/is-exists.decorator';
import { Trip } from 'src/modules/trip/entities/trip.entity';

export class CalculatePriceDto {
  @IsNumber()
  @IsExists(Trip)
  tripId: number;

  @IsNumber()
  @Min(0)
  weight: number;
}
