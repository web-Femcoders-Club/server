/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";

export class ModifySponsorDto {
    @ApiProperty({description:'Name of Sponsor', example:'Mario'})
    sponsorsName: string;

    @ApiProperty({description:'Company of Sponsor', example:'CaixaBank'})
    sponsorsCompany: string;
   
    @ApiProperty({description:'Email of Sponsor', example:'mariosan@gmail.com'})
    sponsorsEmail: string;
   
    @ApiProperty({description:'Telephone of Sponsor', example: '671638473'})
    sponsorsTelephone: number;
}
