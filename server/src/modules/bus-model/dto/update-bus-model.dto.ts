import { PartialType } from '@nestjs/mapped-types';
import { CreateBusModelDto } from './create-bus-model.dto';

export class UpdateBusModelDto extends PartialType(CreateBusModelDto) {}
