/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";

export class CreateSponsorDto {
    @ApiProperty({description:'Name of Sponsor', example:'Mario'})
    sponsorsName: string;
    @ApiProperty({description:'Company of Sponsor', example:'CaixaBank'})
    sponsorsCompany: string;
    @ApiProperty({description:'Email of Sponsor', example:'mariosan@gmail.com'})
    sponsorsEmail: string;
    @ApiProperty({description:'Message of Sponsor', example: 'Hi there! I would like to talk to you'})
    sponsorsMessage?: string;
    @ApiProperty({description:'Telephone of Sponsor', example: '671638473'})
    sponsorsTelephone: number;
    @ApiProperty({description:'Message date sent by the Sponsor', example: '12//07/2024'})
    sponsorsDate: Date;
    @ApiProperty({description:'Message status of Sponsor', example: 'Pending'})
    sponsorsStatus: string;
}
