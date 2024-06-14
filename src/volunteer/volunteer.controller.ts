import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { VolunteerService } from './volunteer.service';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Volunteer')
@Controller('volunteer')
export class VolunteerController {
  constructor(private readonly volunteerService: VolunteerService) {}

  @Post()
  @ApiOperation({summary:'Create a volunteer'})
  @ApiResponse({status: 201,description:'A Volunteer has been succesfully created'})
  @ApiBadRequestResponse({status:404, description: 'Bad Request'})
  @ApiInternalServerErrorResponse({ status:500, description: 'Internal Server Error'})
  create(@Body() createVolunteerDto: CreateVolunteerDto) {
    return this.volunteerService.create(createVolunteerDto);
  }

  @Get()
  @ApiOperation({summary:'List all volunteers'})
  @ApiResponse({status: 200, description: 'List of volunteers'})
  @ApiNotFoundResponse({status: 404, description: 'No volunteers found'})
  findAll() {
    return this.volunteerService.findVolunteers();
  }
  @Get(':id')
  @ApiOperation({summary:'Get a volunteer by id'})
  @ApiResponse({status: 200, description: 'Volunteer details'})
  @ApiNotFoundResponse({status: 404, description: 'Volunteer not found'})
  findOneById(@Param('id') idVolunteer:number){
  return this.volunteerService.findOneById(idVolunteer);
  }

  @Put(':idVolunteer')
  @ApiOperation({summary:'Update a volunteer by id'})
  @ApiResponse({status: 200, description: 'Volunteer updated'})
  @ApiNotFoundResponse({status: 404, description: 'Volunteer not found'})
  update(@Param('idVolunteer') idVolunteer: number, @Body() updateVolunteerDto: UpdateVolunteerDto) {
    return this.volunteerService.update(+idVolunteer, updateVolunteerDto);
  }

  @Delete(':id')
  @ApiOperation({summary:'Delete a volunteer by id'})
  @ApiResponse({status: 200, description: 'Volunteer deleted'})
  @ApiNotFoundResponse({status: 404, description: 'Volunteer not found'})
  remove(@Param('id') id: number) {
    return this.volunteerService.remove(id);
  }
}
