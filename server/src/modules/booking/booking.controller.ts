import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus } from 'src/modules/booking/enums/booking-status.enum';
import { Response } from 'express';
import { Public } from 'src/auth/decorators/public.decorator';
import { CreateBookingPublicDto } from 'src/modules/booking/dto/create-booking-public.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('find-all')
  findAll() {
    return this.bookingService.findAll();
  }

  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @Public()
  @Post('public')
  createPublic(@Body() dto: CreateBookingPublicDto) {
    return this.bookingService.createPublic(dto);
  }

  @Get(':id/confirm')
  confirmBooking(@Param('id') id: string) {
    return this.bookingService.updateBookingStatus(
      +id,
      BookingStatus.CONFIRMED,
    );
  }

  @Get(':id/cancel')
  cancelBooking(@Param('id') id: string) {
    return this.bookingService.updateBookingStatus(
      +id,
      BookingStatus.CANCELLED,
    );
  }

  @Get(':id/payment')
  updatePaymentStatus(@Param('id') id: string) {
    return this.bookingService.updatePaymentStatus(+id);
  }

  @Get(':id/pdf')
  async getInvoicePdf(@Param('id') id: string, @Res() res: Response) {
    const pdfBuffer = await this.bookingService.generateInvoice(+id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename=invoice-${id}.pdf`,
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(+id);
  }
}
