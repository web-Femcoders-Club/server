/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsNotEmpty, IsString } from 'class-validator';

@Entity()
export class Sponsors {
    @PrimaryGeneratedColumn('increment')
    idPotential_Sponsors: number;

    @Column()
    @IsNotEmpty()
    @IsString()
    sponsorsName: string;

    @Column()
    @IsNotEmpty()
    @IsString()
    sponsorsCompany: string;

    @Column()
    @IsNotEmpty()
    @IsString()
    sponsorsEmail: string;

    @Column()
    @IsNotEmpty()
    @IsString()
    sponsorsMessage: string;

    @Column()
    @IsNotEmpty()
    @IsString()
    sponsorsTelephone: number;

    @Column()
    @IsNotEmpty()
    @IsString()
    sponsorsDate: Date;

    @Column()
    @IsNotEmpty()
    sponsorsStatus: string;

}
