import { IsNotEmpty, IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Volunteer {
@PrimaryGeneratedColumn('increment')
idVolunteer: number;

@Column()
@IsNotEmpty()
@IsString()
volunteerName: string;

@Column()
@IsNotEmpty()
@IsString()
volunteerLastName: string;

@Column()
@IsNotEmpty()
@IsString()
volunteerEmail: string;

@Column()
@IsNotEmpty()
@IsString()
volunteerGender: string;


}
