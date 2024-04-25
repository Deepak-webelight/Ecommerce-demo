import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { PublicRoute } from './guards/auth.guard';
import {appConfig}  from './appConfig/configuration';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @PublicRoute()
  @Get()
  getHello(): string {
    console.log(appConfig);
    return this.appService.getHello();
  }
}
