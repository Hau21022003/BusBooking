import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Booking } from 'src/modules/booking/entities/booking.entity';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TripService } from 'src/modules/trip/trip.service';
import { SeatStatus } from 'src/modules/trip/enums/seat-status.enum';
import { BookingStatus } from 'src/modules/booking/enums/booking-status.enum';
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';
import { PaymentStatus } from 'src/modules/booking/enums/payment-status.enum';
import { CreateBookingPublicDto } from 'src/modules/booking/dto/create-booking-public.dto';
import { FindAllDto } from 'src/modules/booking/dto/find-all.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    private tripService: TripService,
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    await this.checkSeatAvailable({
      tripId: createBookingDto.tripId,
      seatRow: createBookingDto.seat.row,
      seatCol: createBookingDto.seat.col,
    });
    const price = await this.getSeatPrice({
      tripId: createBookingDto.tripId,
      seatRow: createBookingDto.seat.row,
      seatCol: createBookingDto.seat.col,
    });

    await this.updateSeatStatus({
      tripId: createBookingDto.tripId,
      seatRow: createBookingDto.seat.row,
      seatCol: createBookingDto.seat.col,
      bookingStatus: createBookingDto.bookingStatus,
    });

    return this.bookingRepository.save({
      ...createBookingDto,
      price: price,
    });
  }

  async createPublic(dto: CreateBookingPublicDto) {
    await this.checkSeatAvailable({
      tripId: dto.tripId,
      seatRow: dto.seat.row,
      seatCol: dto.seat.col,
    });
    const price = await this.getSeatPrice({
      tripId: dto.tripId,
      seatRow: dto.seat.row,
      seatCol: dto.seat.col,
    });

    return this.bookingRepository.save({
      ...dto,
      price: price,
      paymentStatus: PaymentStatus.PENDING,
      bookingStatus: BookingStatus.RESERVED,
    });
  }

  private async updateSeatStatus({
    bookingStatus,
    seatCol,
    seatRow,
    tripId,
  }: {
    tripId: number;
    seatRow: number;
    seatCol: number;
    bookingStatus: BookingStatus;
  }) {
    if (bookingStatus === BookingStatus.CANCELLED) {
      await this.tripService.updateSeatStatus({
        seatCol,
        seatRow,
        tripId,
        seatStatus: SeatStatus.AVAILABLE,
      });
    }

    if (bookingStatus === BookingStatus.CONFIRMED) {
      await this.tripService.updateSeatStatus({
        seatCol,
        seatRow,
        tripId,
        seatStatus: SeatStatus.BOOKED,
      });
    }
  }

  private async checkSeatAvailable({
    seatCol,
    seatRow,
    tripId,
  }: {
    tripId: number;
    seatRow: number;
    seatCol: number;
  }) {
    const trip = await this.tripService.findOne(tripId);
    const seat = trip.seats.find(
      (seat) => seat.row === seatRow && seat.col === seatCol,
    );
    if (!seat) throw new BadRequestException('Seat is invalid');
    if (seat.status === SeatStatus.BOOKED)
      throw new BadRequestException('Seat is booked');
  }

  private async getSeatPrice({
    seatCol,
    seatRow,
    tripId,
  }: {
    tripId: number;
    seatRow: number;
    seatCol: number;
  }) {
    const trip = await this.tripService.findOne(tripId);
    const seat = trip.seats.find(
      (seat) => seat.row === seatRow && seat.col === seatCol,
    );
    const price = trip.prices[seat.type] || 0;
    return price;
  }

  async findAll(findAllDto: FindAllDto) {
    const { phone, bookingStatus, paymentStatus, pageSize, offset } =
      findAllDto;

    const [data, total] = await this.bookingRepository.findAndCount({
      where: {
        ...(phone ? { phone: ILike(`%${phone}%`) } : {}),
        ...(bookingStatus ? { bookingStatus } : {}),
        ...(paymentStatus ? { paymentStatus } : {}),
      },
      order: { createdAt: 'DESC' },
      take: pageSize,
      skip: offset,
      relations: ['trip'],
    });

    return {
      data,
      total,
    };
  }

  findOne(id: number) {
    return this.bookingRepository.findOneByOrFail({ id });
  }

  // Chỉ cho phép chuyển từ trạng thái theo luồng
  // "giữ chỗ" -> "xác nhận" -> "hủy"
  async updateBookingStatus(id: number, bookingStatus: BookingStatus) {
    const booking = await this.findOne(id);

    // Từ trạng thái "xac nhận" sang trạng thái "hủy"
    if (
      bookingStatus === BookingStatus.CANCELLED &&
      booking.bookingStatus === BookingStatus.CONFIRMED
    ) {
      // Cập nhật trạng thái ghế về "có sẵn"
      await this.updateSeatStatus({
        tripId: id,
        seatCol: booking.seat.col,
        seatRow: booking.seat.row,
        bookingStatus: BookingStatus.CANCELLED,
      });
    }
    return this.bookingRepository.update(id, { bookingStatus });
  }

  updatePaymentStatus(id: number) {
    return this.bookingRepository.update(id, {
      paymentStatus: PaymentStatus.PAID,
    });
  }

  async remove(id: number) {
    const booking = await this.findOne(id);
    // booking có trạng thái khác "hủy"
    if (booking.bookingStatus === BookingStatus.CONFIRMED) {
      // Cập nhật trạng thái ghế về "có sẵn"
      await this.updateSeatStatus({
        tripId: id,
        seatCol: booking.seat.col,
        seatRow: booking.seat.row,
        bookingStatus: BookingStatus.CANCELLED,
      });
    }
    return this.bookingRepository.delete({ id });
  }

  async generateInvoice(id: number) {
    const booking = await this.bookingRepository.findOneOrFail({
      where: { id },
      relations: ['trip'],
    });
    const data = {
      ...booking,
      formattedPrice: new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(booking.price),
      formattedDepartureTime: new Intl.DateTimeFormat('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(new Date(booking.trip.departureTime)),
      seatRow: booking.seat.row + 1,
      seatCol: booking.seat.col + 1,
    };

    // 1. Load template HTML
    const templatePath = path.join(__dirname, 'templates', 'invoice.hbs');
    const templateFile = fs.readFileSync(templatePath, 'utf-8');
    const template = handlebars.compile(templateFile);

    // 2. Inject data vào HTML
    const html = template(data);

    // 3. Render PDF bằng Puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    const pdfBuffer = await page.pdf({
      width: '80mm', // hoặc '58mm' tùy khổ máy in
      height: '200mm', // chiều cao có thể để auto, hoặc set tạm rồi dùng page-break
      printBackground: true,
    });
    await browser.close();

    return pdfBuffer;
  }
}
