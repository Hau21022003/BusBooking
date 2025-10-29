import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { FindAllDto } from 'src/modules/trip/dto/find-all.dto';
import { UpdateStatusDto } from 'src/modules/trip/dto/update-status.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { FindAllPublicDto } from 'src/modules/trip/dto/find-all-public.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('trip')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post('find-all')
  findAll(@Body() dto: FindAllDto) {
    return this.tripService.findAll(dto);
  }

  @Public()
  @UseInterceptors(CacheInterceptor)
  @Get('find-all-public')
  findAllPublic(@Query() dto: FindAllPublicDto) {
    return this.tripService.findAllPublic(dto);
  }

  @Post()
  create(@Body() createTripDto: CreateTripDto) {
    return this.tripService.create(createTripDto);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tripService.findOne(+id);
  }

  @Put(':id/update-status')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.tripService.updateStatus(+id, updateStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tripService.remove(+id);
  }
}
