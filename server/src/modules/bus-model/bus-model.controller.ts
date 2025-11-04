import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { BusModelService } from './bus-model.service';
import { CreateBusModelDto } from './dto/create-bus-model.dto';
import { UpdateBusModelDto } from './dto/update-bus-model.dto';

@Controller('bus-model')
export class BusModelController {
  constructor(private readonly busModelService: BusModelService) {}

  @Post()
  create(@Body() createBusModelDto: CreateBusModelDto) {
    return this.busModelService.create(createBusModelDto);
  }

  @Get()
  findAll() {
    return this.busModelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.busModelService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateBusModelDto: UpdateBusModelDto,
  ) {
    return this.busModelService.update(+id, updateBusModelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.busModelService.remove(+id);
  }
}
