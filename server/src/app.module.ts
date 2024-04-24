import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { userModule } from './modules/user/user.module';
import configuration from './appConfig/configuration';
import configValidation from './appConfig/configuration.validate';
import { JwtModule } from '@nestjs/jwt';
import { Iconfiguration } from './modules/user/user.interface';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: configValidation,
      load: [configuration],
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      global: true,
      useFactory: (configService: ConfigService<Iconfiguration>) => ({
        secret: configService.get('jwtSecret'),
      }),
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    userModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
