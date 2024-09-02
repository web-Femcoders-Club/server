/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */

import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';

import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user' })
  @ApiResponse({ status: 201, description: 'User successfully signed up' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async signup(@Body() signupDto: SignupDto) {
    try {
      return await this.authService.signup(signupDto);
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Unexpected error', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  @ApiOperation({ summary: 'Log in a user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto);
    } catch (error) {
      if (error instanceof Error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Unexpected error', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Generate a reset password link' })
  @ApiResponse({
    status: 200,
    description: 'Reset link generated successfully',
  })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request' })
  async forgotPassword(@Body('email') email: string) {
    if (!email) {
      throw new BadRequestException('Email es requerido');
    }

    const resetLink = await this.authService.generateResetPasswordToken(email);

    return {
      resetLink,
      message: 'Enlace de restablecimiento generado con éxito',
    };
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset user password using email' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Invalid email or password',
  })
  async resetPassword(
    @Body('email') email: string,
    @Body('newPassword') newPassword: string,
  ) {
    const user = await this.authService.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException('Email no encontrado');
    }

    await this.authService.updatePassword(user.idUser, newPassword);
    return { message: 'Contraseña actualizada con éxito' };
  }

  @Get('status')
  @ApiOperation({ summary: 'Check user authentication status' })
  @ApiResponse({ status: 200, description: 'User authentication status' })
  user(@Req() request: Request & { user: any }) {
    if (request.user) {
      return { msg: 'Authenticated', user: request.user };
    } else {
      return { msg: 'Not Authenticated' };
    }
  }
}
