import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByUsername(
      registerDto.username,
    );
    if (existingUser) {
      throw new ForbiddenException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser = await this.usersService.create({
      username: registerDto.username,
      password: hashedPassword,
    });

    const payload = { username: newUser.username, userId: newUser._id };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken, userId: newUser._id, username: newUser.username };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByUsername(loginDto.username);
    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
      const payload = { username: user.username, userId: user._id };
      return {
        accessToken: this.jwtService.sign(payload),
        userId: user._id,
        username: user.username,
      };
    }
    throw new ForbiddenException('Invalid credentials');
  }
}
