import { IsEnum, IsNotEmpty } from 'class-validator';
import { SettingKey } from 'src/modules/settings/enum/setting-key.enum';

export class CreateSettingDto {
  @IsEnum(SettingKey)
  key: SettingKey;

  @IsNotEmpty()
  value: any;
}
