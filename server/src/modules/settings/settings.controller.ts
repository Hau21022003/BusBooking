import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { SettingKey } from 'src/modules/settings/enum/setting-key.enum';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get(':key')
  async get(@Param('key') key: SettingKey) {
    return { key, value: await this.settingsService.get(key) };
  }

  @Post()
  async set(@Body() body: CreateSettingDto) {
    return { key: body.key, value: this.settingsService.set(body) };
  }
}
