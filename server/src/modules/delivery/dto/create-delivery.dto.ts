import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsExists } from 'src/common/decorators/is-exists.decorator';
import { DeliveryStatus } from 'src/modules/delivery/entities/delivery.entity';
import { Station } from 'src/modules/station/entities/station.entity';
import { Trip } from 'src/modules/trip/entities/trip.entity';

export class CreateDeliveryDto {
  @IsString()
  @IsNotEmpty()
  senderName: string;

  @IsString()
  @IsNotEmpty()
  senderPhone: string;

  @IsString()
  @IsNotEmpty()
  receiverName: string;

  @IsString()
  @IsNotEmpty()
  receiverPhone: string;

  // @IsString()
  // @IsNotEmpty()
  // pickupLocation: string;

  // @IsString()
  // @IsNotEmpty()
  // dropoffLocation: string;

  @IsNumber()
  @IsExists(Station)
  pickupStationId: number;

  @IsNumber()
  @IsExists(Station)
  dropoffStationId: number;

  @IsNumber()
  weight: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(DeliveryStatus)
  status?: DeliveryStatus;

  @IsOptional()
  @IsNumber()
  @IsExists(Trip)
  tripId?: number;
}
