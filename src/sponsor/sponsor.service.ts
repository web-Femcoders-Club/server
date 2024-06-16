/* eslint-disable prettier/prettier */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Sponsors } from './entities/sponsor.entity';
import { CreateSponsorDto } from './dto/create-sponsor.dto';
import { ModifySponsorDto } from './dto/modify-sponsor.dto';


@Injectable()
export class SponsorService {
    constructor(
        @InjectRepository(Sponsors)
        private sponsorRepository: Repository<Sponsors>,
        @InjectDataSource()
        private dataSource: DataSource,
    ){}

    create (AddSponsorDto: CreateSponsorDto){
        return this.sponsorRepository.save(AddSponsorDto);
    }

    async findOneByName(name: string): Promise<Sponsors | undefined> {
        return this.sponsorRepository.findOne({ where: { sponsorsName: name } });
    }

    async modifySponsor(sponsor_Id: number, editSponsor: ModifySponsorDto){
        const queryRunner = this.dataSource.createQueryRunner();
    
        await queryRunner.connect();
        await queryRunner.startTransaction();
    
        try{
            const sponsor = await queryRunner.manager.findOne(Sponsors, {
                where: { idPotential_Sponsors: sponsor_Id }
            })
    
            if(!sponsor){
                throw new HttpException(`Not sponsor found`, 404);
            }
    
        sponsor.sponsorsName = editSponsor.sponsorsName;
        sponsor.sponsorsCompany = editSponsor.sponsorsCompany;
        sponsor.sponsorsEmail = editSponsor.sponsorsEmail;
        sponsor.sponsorsTelephone = editSponsor.sponsorsTelephone;
    
        await queryRunner.manager.save(Sponsors, sponsor);
        
        await queryRunner.commitTransaction();
            return `sponsor successfully modified`
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
    
    async removeSponsor(sponsor_Id: number) {
        const result = await this.sponsorRepository.delete({ idPotential_Sponsors: +sponsor_Id });
        if (result) return { message: 'delete OK' };
    }

    
    async findAll () {
        const sponsors = await this.sponsorRepository.find({ 
        });
        return sponsors;
    }

    async findOneById(sponsor_id: number) {
        const sponsor = await this.sponsorRepository.find({ where: { idPotential_Sponsors: sponsor_id } });
        if(!sponsor){
            throw new HttpException(`No sponsor found`, 404);
        }
        return sponsor;
    }
}
