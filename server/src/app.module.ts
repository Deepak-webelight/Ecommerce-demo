import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { userModule } from './modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
// import { Iconfiguration } from './modules/user/user.interface';
import { productModule } from './modules/products/products.module';
import { AuthGuard } from './guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/role-auth.guard';
import { appConfig } from './appConfig/configuration';
import { SuperAdminAuthGuard } from './guards/superAdmin.auth.guard';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: appConfig.jwtSecret,
    }),
    MongooseModule.forRoot(appConfig.mongodbUrl),
    userModule,
    productModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: SuperAdminAuthGuard,
    },
  ],
})
export class AppModule {}
