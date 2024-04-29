import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { userModule } from './modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { productModule } from './modules/products/products.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { appConfig } from './appConfig/configuration';
import {
  ErrorsResponseInterceptor,
  ResponseInterceptor,
} from './intercepter/response.intercepter';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: appConfig.jwtSecret,
    }),
    MongooseModule.forRoot(appConfig.mongodbUrl),
    userModule,
    productModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsResponseInterceptor,
    },
  ],
})
export class AppModule {}
