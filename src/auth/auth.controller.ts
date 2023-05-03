import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LoginUserDto, RegisterUserDto } from './auth.dto';

import { AuthService } from './auth.service';
import { LocalGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() user: RegisterUserDto) {
    return this.authService.registerUser(user);
  }

  @UseGuards(LocalGuard)
  @Post('login')
  loginUser(@Req() req, @Body() user: LoginUserDto) {
    return req.session;
  }
}
