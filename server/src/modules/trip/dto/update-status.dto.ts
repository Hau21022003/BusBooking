import { TripStatus } from 'src/modules/trip/enums/trip-status.enum';
import { IsEnum } from 'class-validator';

export class UpdateStatusDto {
  @IsEnum(TripStatus)
  status: TripStatus;
}
