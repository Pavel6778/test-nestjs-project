import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggedInGuard, SessionTimeGuard } from '../auth/guards';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(LoggedInGuard, SessionTimeGuard)
  @Get('some-protected-url')
  guardedRoute() {
    return this.appService.getProtectedMessage();
  }
}
