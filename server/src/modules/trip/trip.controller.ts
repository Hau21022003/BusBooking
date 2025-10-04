import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { FindAllDto } from 'src/modules/trip/dto/find-all.dto';
import { UpdateStatusDto } from 'src/modules/trip/dto/update-status.dto';

@Controller('trip')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post('find-all')
  findAll(@Body() dto: FindAllDto) {
    return this.tripService.findAll(dto);
  }

  @Post()
  create(@Body() createTripDto: CreateTripDto) {
    return this.tripService.create(createTripDto);
  }

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
