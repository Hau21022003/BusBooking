import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IsExists } from 'src/common/decorators/is-exists.decorator';
import { BookingStatus } from 'src/modules/booking/enums/booking-status.enum';
import { PaymentStatus } from 'src/modules/booking/enums/payment-status.enum';
import { Trip } from 'src/modules/trip/entities/trip.entity';

class SeatDto {
  @IsNumber()
  row: number;

  @IsNumber()
  col: number;
}

export class CreateBookingDto {
  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  pickupLocation?: string;

  @IsNumber()
  @IsExists(Trip)
  tripId: number;

  @ValidateNested()
  @Type(() => SeatDto)
  seat: SeatDto;

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @IsOptional()
  @IsIn([BookingStatus.RESERVED, BookingStatus.CONFIRMED])
  bookingStatus?: BookingStatus;
}
