/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { EventbriteService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventbriteService: EventbriteService) {}

  // Método para crear un evento desde la base de datos
  @Post('create/event')
  @ApiOperation({ summary: 'Create an event' })
  @ApiResponse({
    status: 201,
    description: 'An event has been successfully created',
  })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request' })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventbriteService.createEvent(createEventDto);
  }

  @Post('update/event/:idEvent')
  @ApiOperation({ summary: 'Update an event by id' })
  @ApiResponse({ status: 200, description: 'Event updated' })
  @ApiBadRequestResponse({ status: 400, description: 'Bad Request' })
  @ApiNotFoundResponse({ status: 404, description: 'Event not found' })
  updateEvent(
    @Param('idEvent') idEvent: string,
    @Body() event: UpdateEventDto,
  ) {
    return this.eventbriteService.updateEvent(idEvent, event);
  }

  @Get('api/list')
  @ApiOperation({ summary: 'List all events from database' })
  @ApiResponse({ status: 200, description: 'List of events' })
  @ApiNotFoundResponse({ status: 404, description: 'No events found' })
  findAll() {
    return this.eventbriteService.findAllFromDatabase();
  }

  @Get('api/list/past')
  @ApiOperation({ summary: 'List all past events from database' })
  @ApiResponse({ status: 200, description: 'List of past events' })
  @ApiNotFoundResponse({ status: 404, description: 'No past events found' })
  findPastEvents() {
    return this.eventbriteService.findPastEvents();
  }

  @Get('api/list/upcoming')
  @ApiOperation({ summary: 'List all upcoming events from database' })
  @ApiResponse({ status: 200, description: 'List of upcoming events' })
  @ApiNotFoundResponse({ status: 404, description: 'No upcoming events found' })
  findUpcomingEvents() {
    return this.eventbriteService.findUpcomingEvents();
  }

  @Get('sync')
  @ApiOperation({ summary: 'Sync new events from Eventbrite' })
  @ApiResponse({ status: 200, description: 'Events synced successfully' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async syncEvents() {
    try {
      await this.eventbriteService.syncEvents();
      return { message: 'Events synced successfully' };
    } catch (error) {
      return {
        message: 'Error syncing events',
        error: (error as Error).message,
      };
    }
  }
}
