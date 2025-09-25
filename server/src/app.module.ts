import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IsExistConstraint } from 'src/common/validators/is-exist-constraint.validator';
import { dbOptions, load } from 'src/config/db.config';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [
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
    AuthModule,
    UsersModule,
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
