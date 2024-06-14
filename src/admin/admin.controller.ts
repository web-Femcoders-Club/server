/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateSponsorDto } from '../sponsor/dto/create-sponsor.dto';
import { ModifySponsorDto } from '../sponsor/dto/modify-sponsor.dto';
import { ApiBadRequestResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin Dashboard')
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) {}

    @Get()
    @ApiOperation({ summary: 'Get all sponsors' })
    @ApiResponse({ status: 200, description: 'List of all sponsors' })
    @ApiNotFoundResponse({ status: 404, description: 'No sponsors found' })
    findAllSponsors() {
        return this.adminService.findAllSponsors();
    }
    @Get(':sponsor_id')
    @ApiOperation({ summary: 'Get sponsor by ID' })
    @ApiResponse({ status: 200, description: 'Sponsor details' })
    @ApiNotFoundResponse({ status: 404, description: 'Sponsor not found' })
    findSponsorById(@Param('sponsor_id') sponsor_id:number){
        return this.adminService.findSponsorById(sponsor_id);
    }
    
    @Post()
    @ApiOperation({ summary: 'Add a new sponsor' })
    @ApiResponse({ status: 201, description: 'Sponsor successfully added' })
    @ApiBadRequestResponse({ status: 400, description: 'Bad Request' })
    @ApiInternalServerErrorResponse({ status: 500, description: 'Internal Server Error' })
    addSponsor( @Body() addSponsor: CreateSponsorDto ){
        return this.adminService.addSponsor(addSponsor);
    }

    @Put(':sponsor_Id')
    @ApiOperation({ summary: 'Edit a sponsor by ID' })
    @ApiResponse({ status: 200, description: 'Sponsor successfully edited' })
    @ApiNotFoundResponse({ status: 404, description: 'Sponsor not found' })
    @ApiBadRequestResponse({ status: 400, description: 'Bad Request' })
    editSponsor(@Param('sponsor_Id') sponsor_Id: number, @Body() editSponsor: ModifySponsorDto){
        return this.adminService.editSponsor(sponsor_Id, editSponsor);
    }

    @Delete('/:sponsorId')
    @ApiOperation({ summary: 'Delete a sponsor by ID' })
    @ApiResponse({ status: 200, description: 'Sponsor successfully deleted' })
    @ApiNotFoundResponse({ status: 404, description: 'Sponsor not found' })
    deleteSponsor(@Param('sponsorId') sponsor_Id: number) {
        return this.adminService.deleteSponsor(sponsor_Id);    
    }
}
