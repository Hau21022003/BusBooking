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
import { Public } from 'src/auth/decorators/public.decorator';
import { FindAllPublicDto } from 'src/modules/trip/dto/find-all-public.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/modules/users/entities/user.entity';

@Controller('trip')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Roles(Role.ADMIN, Role.STATION_STAFF)
  @Post('find-all')
  findAll(@Body() dto: FindAllDto) {
    return this.tripService.findAll(dto);
  }

  @Public()
  @Post('find-all-public')
  findAllPublic(@Body() dto: FindAllPublicDto) {
    return this.tripService.findAllPublic(dto);
  }

  @Post()
  @Roles(Role.ADMIN, Role.STATION_STAFF)
  create(@Body() createTripDto: CreateTripDto) {
    return this.tripService.create(createTripDto);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tripService.findOne(+id);
  }

  @Put(':id/update-status')
  @Roles(Role.ADMIN, Role.STATION_STAFF)
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.tripService.updateStatus(+id, updateStatusDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.STATION_STAFF)
  remove(@Param('id') id: string) {
    return this.tripService.remove(+id);
  }
}
