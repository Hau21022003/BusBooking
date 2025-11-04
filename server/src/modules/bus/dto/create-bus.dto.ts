import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsExists } from 'src/common/decorators/is-exists.decorator';
import { BusModel } from 'src/modules/bus-model/entities/bus-model.entity';

export class CreateBusDto {
  @IsString()
  @IsNotEmpty()
  licensePlate: string;

  @IsNumber()
  @IsExists(BusModel)
  busModelId: number;
}
