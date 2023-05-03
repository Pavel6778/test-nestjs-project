import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getProtectedMessage(): string {
    return 'You can only see this message if you are logged in and session does not exceed 1h';
  }
}
