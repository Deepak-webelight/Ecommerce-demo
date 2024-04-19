import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { userModule } from './user/user.module';
import configuration from './appConfig/configuration';
import configValidation from './appConfig/configuration.validate';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: configValidation,
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    userModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
