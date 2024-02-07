import { Body, Controller, Get, Post, Request, Response } from '@nestjs/common';
import { CreateUserDto } from 'src/user/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() userDto: CreateUserDto) {
    return await this.authService.register(userDto);
  }

  @Post('login')
  async login(@Request() req, @Response() res) {
    // ❶ Request, Response를 둘 다 사용
    // ❷ validateUser를 호출해 유저 정보 획득
    const userInfo = await this.authService.validateUser(
      req.body.email,
      req.body.password,
    );

    // ❸ 유저 정보가 있으면, 쿠키 정보를 Response에 저장
    if (userInfo) {
      res.cookie('login', JSON.stringify(userInfo), {
        httpOnly: false, // ❹ 브라우저에서 읽을 수 있도록 함
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7day 단위는 밀리초
      });
    }
    return res.send({ message: 'login success' });
  }
}
