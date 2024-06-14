import { Body, Controller, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put(':user_id')
  @ApiOperation({summary:'Update a user by id'})
  @ApiResponse({status: 200, description: 'User updated'})
  @ApiNotFoundResponse({status: 404, description: 'User not found'})
  updateUser(@Param('user_id') user_id:number, @Body() editUser: UpdateUserDto){
      return this.userService.updateUser(user_id, editUser);
  }
  
}
