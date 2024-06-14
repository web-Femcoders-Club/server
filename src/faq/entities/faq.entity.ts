import { IsNotEmpty, IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Faq {

    @PrimaryGeneratedColumn('increment')
    idFaq: number;

    @Column()
    @IsNotEmpty()
    @IsString()
    faqQuestion: string;

    @Column()
    @IsNotEmpty()
    @IsString()
    faqAnswer: string;

}
