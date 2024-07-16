/* eslint-disable prettier/prettier */

import { Body, Controller, Get, Param, Post, Put, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiNotFoundResponse({ status: 404, description: 'User not found' })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Put(':user_id')
  @ApiOperation({ summary: 'Update a user by id' })
  @ApiResponse({ status: 200, description: 'User updated' })
  @ApiNotFoundResponse({ status: 404, description: 'User not found' })
  updateUser(@Param('user_id') user_id: number, @Body() editUser: UpdateUserDto) {
    return this.userService.updateUser(user_id, editUser);
  }

  @Get(':user_id')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({ status: 200, description: 'User found' })
  @ApiNotFoundResponse({ status: 404, description: 'User not found' })
  getUserById(@Param('user_id') user_id: number) {
    return this.userService.findOneById(user_id);
  }

  @Delete(':user_id')
  @ApiOperation({ summary: 'Delete a user by id' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  @ApiNotFoundResponse({ status: 404, description: 'User not found' })
  deleteUser(@Param('user_id') user_id: number) {
    return this.userService.remove(user_id);
  }
}


