import { Injectable } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import PrismaService from '../database/database.service';

@Injectable()
export class SettingsService {
  constructor(private readonly db: PrismaService) {}

  create(createSettingDto: CreateSettingDto) {
    return 'This action adds a new setting';
  }

  findAll() {
    return `This action returns all settings`;
  }

  findOne(id: number) {
    return `This action returns a #${id} setting`;
  }

  async update(id: string, updateSettingDto: UpdateSettingDto) {
    return this.db.setting.update({
      where: {
        id,
      },
      data: { ...updateSettingDto },
    });
  }
}
