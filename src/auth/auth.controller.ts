import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from '../user/user.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({ status: 201, description: 'User successfully signed up' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ status: 500, description: 'Internal Server Error' })
  signup(
    @Body()
    signupDto: SignupDto,
  ) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Log in a user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({ status: 500, description: 'Internal Server Error' })
  async login(@Body() loginDto: LoginDto) {
  
    return this.authService.login(loginDto);
  }
  


@Get('status')
@ApiOperation({ summary: 'Check user authentication status' })
@ApiResponse({ status: 200, description: 'User authentication status' })
user(@Req() request: Request) {
  if (request.user) {
    return { msg: 'Authenticated' };
  } else {
    return { msg: 'Not Authenticated' };
  }
}


}
