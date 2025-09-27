import { PartialType } from '@nestjs/mapped-types';
import { CreateBusDto } from 'src/modules/bus/dto/create-bus.dto';

export class UpdateBusDto extends PartialType(CreateBusDto) {}
