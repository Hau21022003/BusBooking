import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { FindAllDto } from 'src/modules/delivery/dto/find-all.dto';

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post()
  create(
    @Body() createDeliveryDto: CreateDeliveryDto,
    @GetUser('sub') userId: string,
  ) {
    return this.deliveryService.create(createDeliveryDto, userId);
  }

  @Post('find-all')
  findAll(@Body() dto: FindAllDto) {
    return this.deliveryService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliveryService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateDeliveryDto: UpdateDeliveryDto,
    @GetUser('sub') userId: string,
  ) {
    return this.deliveryService.update(+id, updateDeliveryDto, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deliveryService.remove(+id);
  }
}
