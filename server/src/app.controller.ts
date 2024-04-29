import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
// import { PublicRoute } from './guards/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @PublicRoute()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
