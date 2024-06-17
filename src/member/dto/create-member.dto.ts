/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";

export class CreateMemberDto {
    @ApiProperty({
        description: 'The name of the member',
        example: 'John Doe',
    })
    memberName: string;
    @ApiProperty({
        description: 'The last name of the member',
        example: 'Doe',
    })
    memberLastName: string;
    @ApiProperty({
        description: 'A description of the member',
        example: 'John Doe is a great member of our team',
    })
    memberDescription: string;
    @ApiProperty({
        description: 'The role of the member',
        example: 'Developer',
    })
    memberRole: string;

    @ApiProperty({
        description: 'The image URL of the member',
        example: 'https://example.com/image.jpg',
    })
    memberImage: string;

    @ApiProperty({
        description: 'The image URL of the member',
        example: 'https://www.linkedin.com',
    })
    memberLinkedin: string;
}
