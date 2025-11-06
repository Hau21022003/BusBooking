import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { BookingStatus } from 'src/modules/booking/enums/booking-status.enum';
import { PaymentStatus } from 'src/modules/booking/enums/payment-status.enum';

export class FindAllDto extends PaginationDto {
  @IsString()
  @IsOptional()
  phone: string;

  @IsOptional()
  @IsEnum(BookingStatus)
  bookingStatus: BookingStatus;

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;
}
