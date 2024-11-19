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
  @ApiOperation({ summary: 'List all events' })
  @ApiResponse({ status: 200, description: 'List of events' })
  @ApiNotFoundResponse({ status: 404, description: 'No events found' })
  findAll() {
    return this.eventbriteService.findAll();
  }

  @Get('api/list/past')
  @ApiOperation({ summary: 'List all past events' })
  @ApiResponse({ status: 200, description: 'List of past events' })
  findAllPastEvents() {
    return this.eventbriteService.findAllPastEvents();
  }

  @Get('api/list/upcoming')
  @ApiOperation({ summary: 'List all upcoming events' })
  @ApiResponse({ status: 200, description: 'List of upcoming events' })
  findAllUpcomingEvents() {
    return this.eventbriteService.findAllUpcomingEvents();
  }

  @Get('sync')
  @ApiOperation({ summary: 'Sync events from Eventbrite' })
  @ApiResponse({ status: 200, description: 'Events synced' })
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
