/* eslint-disable prettier/prettier */
 import { ApiProperty } from "@nestjs/swagger";

 export class CreateEventDto {
  @ApiProperty({
    description: 'Event details',
    type: 'object',
    properties: {
      name: {
        type: 'string',
        format: 'html',
        description: 'Event name in HTML format',
        example: '<h1>Event Name</h1>',
      },
      start: {
        type: 'object',
        properties: {
          timezone: {
            type: 'string',
            description: 'Timezone of the event start date',
            example: 'UTC',
          },
          utc: {
            type: 'string',
            format: 'date-time',
            description: 'Event start date and time in UTC',
            example: '2023-04-05T12:00:00Z',
          },
        },
      },
      end: {
        type: 'object',
        properties: {
          timezone: {
            type: 'string',
            description: 'Timezone of the event end date',
            example: 'UTC',
          },
          utc: {
            type: 'string',
            format: 'date-time',
            description: 'Event end date and time in UTC',
            example: '2023-04-05T18:00:00Z',
          },
        },
      },
      currency: {
        type: 'string',
        description: 'Currency used for the event',
        example: 'EURO',
      },
    },
  })
  event: {
    name: {
      html: string;
    };
    start: {
      timezone: string;
      utc: Date;
    };
    end: {
      timezone: string;
      utc: Date;
    };
    currency: string;
  };
}

