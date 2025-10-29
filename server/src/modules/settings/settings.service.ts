import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Setting } from 'src/modules/settings/entities/setting.entity';
import { Repository } from 'typeorm';
import { SettingKey } from 'src/modules/settings/enum/setting-key.enum';
import { SettingType } from 'src/modules/settings/enum/setting-type.enum';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private settingRepository: Repository<Setting>,
  ) {}

  async get(key: SettingKey): Promise<any> {
    const setting = await this.settingRepository.findOneBy({ key });
    if (!setting) throw new NotFoundException(`Setting key ${key} not found`);

    switch (setting.type) {
      case SettingType.NUMBER:
        return Number(setting.value);
      case SettingType.BOOLEAN:
        return setting.value === 'true';
      case SettingType.JSON:
        return JSON.parse(setting.value);
      default:
        return setting.value;
    }
  }

  async set(createSettingDto: CreateSettingDto) {
    let strValue;

    let type: SettingType = SettingType.STRING;
    const value = createSettingDto.value;
    switch (typeof value) {
      case 'object':
        strValue = JSON.stringify(value);
        type = SettingType.JSON;
        break;

      case 'boolean':
        strValue = value ? 'true' : 'false';
        type = SettingType.BOOLEAN;
        break;

      case 'number':
        strValue = value.toString();
        type = SettingType.NUMBER;
        break;

      default:
        strValue = value;
        type = SettingType.STRING;
        break;
    }

    await this.settingRepository.upsert(
      {
        key: createSettingDto.key,
        value: strValue,
        type,
      },
      ['key'], // cột để xác định trùng lặp
    );
    return await this.get(createSettingDto.key);
  }
}
