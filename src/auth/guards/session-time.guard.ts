import {
  UnauthorizedException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { HOUR } from '../../shared/constants';

@Injectable()
export class SessionTimeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const now = Date.now();
    const { user } = req;

    if (
      user &&
      user.lastAccessTime &&
      now - user.lastAccessTime > HOUR
    ) {
      // Session is expired, invalidate it
      req.session.destroy();

      throw new UnauthorizedException(
        'you have been active for more than one hour, which is unacceptable, you will be able to login again in 5 minutes',
      );
    }

    return true;
  }
}