/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";

export class CreateVolunteerDto {
@ApiProperty({description: 'Name of the Volunteer', example:'Sara'})
volunteerName: string;

@ApiProperty({description: 'Last Name of the Volunteer', example:'Smith'})
volunteerLastName: string;

@ApiProperty({description: 'Email of the Volunteer', example:'sarasmith@gmail.com'})
volunteerEmail: string;

@ApiProperty({description: 'Gender of the Volunteer', example:'she/her'})
volunteerGender: string;
}
