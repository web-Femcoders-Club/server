/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Member {
    @PrimaryGeneratedColumn('increment')
    idMember: number;

    @Column()
    @IsNotEmpty()
    @IsString()
    memberName: string;

    @Column()
    @IsNotEmpty()
    @IsString()
    memberLastName: string;

    @Column('text')
    @IsNotEmpty()
    memberDescription: string;

    @Column()
    @IsString()
    memberRole: string;

    @Column()
    @IsString()
    memberImage: string;

    @Column()
    @IsString()
    memberLinkedin: string;
}

