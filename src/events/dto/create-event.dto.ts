/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";

export class CreateEventDto {
  @ApiProperty({
    description: 'Event name',
    example: 'Event Name',
  })
  eventName: string;

  @ApiProperty({
    description: 'Event start date and time in UTC',
    example: '2023-04-05T12:00:00Z',
  })
  eventStart: Date;

  @ApiProperty({
    description: 'Event end date and time in UTC',
    example: '2023-04-05T18:00:00Z',
  })
  eventEnd: Date;

  @ApiProperty({
    description: 'Timezone of the event',
    example: 'UTC',
  })
  eventTimezone: string;

  @ApiProperty({
    description: 'Currency used for the event',
    example: 'EURO',
  })
  eventCurrency: string;
}

