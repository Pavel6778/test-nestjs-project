import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare, hash } from 'bcrypt';

import { HOUR, MIN } from '../shared/constants';
import { User } from './auth.interfaces';
import { LoginUserDto, RegisterUserDto } from './auth.dto';

@Injectable()
export class AuthService {
  private users: User[] = [
    {
      id: 1,
      firstName: 'First',
      lastName: 'User',
      email: 'first@test.com',
      // password: first
      password: '$2b$12$9cYzYGlA1n6QpLJAjFq0NOlivB92H/OY2Z7YP3fH8Q5xM1Cwdyc.u',
      lastAccessTime: null,
    },
    {
      id: 2,
      firstName: 'Second',
      lastName: 'User',
      email: 'second@test.com',
      // password: second
      password: '$2b$12$5gi.atbo0RqBqp8xbm2mgeCtwLErfg/lpS.crIP129O8jL7ElQTOm',
      lastAccessTime: null,
    },
  ];

  async validateUserAndUpdateActivityTime(
    user: LoginUserDto,
  ): Promise<Omit<User, 'password'>> {
    const foundUser = this.users.find((u) => u.email === user.email);
    if (
      !user ||
      !foundUser ||
      !(await compare(user.password, foundUser.password))
    ) {
      throw new UnauthorizedException('Incorrect username or password');
    }

    const now = Date.now();

    if (
      foundUser.lastAccessTime &&
      now - foundUser.lastAccessTime > HOUR &&
      now - foundUser.lastAccessTime < HOUR + 5 * MIN
    ) {
      throw new UnauthorizedException(
        'This user has been banned for 5 minutes, please try again later',
      );
    }

    if (
      !foundUser.lastAccessTime ||
      now - foundUser.lastAccessTime > HOUR + 5 * MIN
    ) {
      foundUser.lastAccessTime = now;
    }

    const { password, ...retUser } = foundUser;

    return retUser;
  }

  async registerUser(user: RegisterUserDto): Promise<Omit<User, 'password'>> {
    const test1 = await hash('first', 12)
    const test2 = await hash('second', 12)
    console.log(test1)
    console.log(test2)
    const existingUser = this.users.find((u) => u.email === user.email);
    if (existingUser) {
      throw new BadRequestException('User email must be unique');
    }
    if (user.password !== user.confirmationPassword) {
      throw new BadRequestException(
        'Password and Confirmation Password must match',
      );
    }
    const { confirmationPassword, ...newUser } = user;
    this.users.push({
      ...newUser,
      lastAccessTime: null,
      password: await hash(user.password, 12),
      id: this.users.length + 1,
    });
    return {
      id: this.users.length,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      lastAccessTime: null,
    };
  }

  findById(id: number): Omit<User, 'password'> {
    const { password, ...user } = this.users.find((u) => u.id === id);
    if (!user) {
      throw new BadRequestException(`No user found with id ${id}`);
    }
    return user;
  }
}
