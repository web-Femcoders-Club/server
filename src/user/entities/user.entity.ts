/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { Exclude } from "class-transformer";

@Entity()
export class User {
    @PrimaryGeneratedColumn('increment')
    idUser: number;

    @Column()
    @IsNotEmpty()
    @IsString()
    userName: string;

    @Column()
    @IsNotEmpty()
    @IsString()
    userLastName: string;

    @Column()
    @IsNotEmpty()
    @IsString()
    userEmail: string;

    @Column()
    @IsNotEmpty()
    @IsString()
    userPassword: string;

    @Column()
    @IsNotEmpty()
    @IsString()
    userRole: string;

    @Column()
    @IsNotEmpty()
    @IsString()
    userGender: string;

    @Column()
    @IsNotEmpty()
    @IsString() 
    userTelephone: string;

    @Column({ type: 'text', nullable: true })
    @IsOptional() 
    @IsString()
    userAvatar: string | null;

    @Exclude()
    public currentHashedRefreshToken?: string;

    @Column({ default: false })
    public isRegisteredWithGoogle: boolean;
}


