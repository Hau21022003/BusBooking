import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class UpdateActiveDto {
  @IsBoolean()
  @Transform(({ value }) => (value === 'true' ? true : false))
  active: boolean;
}
