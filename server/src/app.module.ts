import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IsExistConstraint } from 'src/common/validators/is-exist-constraint.validator';
import { dbOptions, load } from 'src/config/db.config';
import { BusModule } from 'src/modules/bus/bus.module';
import { UsersModule } from 'src/modules/users/users.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { FileUploadModule } from 'src/modules/file-upload/file-upload.module';
import { ProvinceModule } from 'src/modules/province/province.module';
import { StationModule } from 'src/modules/station/station.module';
import { RouteModule } from 'src/modules/route/route.module';
import { TripModule } from 'src/modules/trip/trip.module';
import { SchedulesModule } from 'src/modules/schedules/schedules.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BookingModule } from 'src/modules/booking/booking.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { DeliveryModule } from 'src/modules/delivery/delivery.module';
import { SettingsModule } from 'src/modules/settings/settings.module';

@Module({
  imports: [
    CacheModule.register({
      ttl: 300 * 1000, // Thời gian sống của cache (milliseconds)
      max: 100, // Số lượng cache tối đa
      isGlobal: true, // Cho phép dùng cache toàn ứng dụng
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [load],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: dbOptions,
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    BusModule,
    CloudinaryModule,
    FileUploadModule,
    ProvinceModule,
    StationModule,
    RouteModule,
    TripModule,
    SchedulesModule,
    BookingModule,
    DeliveryModule,
    SettingsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    IsExistConstraint,
  ],
})
export class AppModule {}
