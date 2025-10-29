import { BaseEntity } from 'src/common/entities/base.entity';
import { SettingKey } from 'src/modules/settings/enum/setting-key.enum';
import { SettingType } from 'src/modules/settings/enum/setting-type.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Setting extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: SettingKey,
    unique: true,
  })
  key: SettingKey;

  @Column({ type: 'text' })
  value: string;

  @Column({
    type: 'enum',
    enum: SettingType,
    default: SettingType.STRING,
  })
  type: SettingType;
}
