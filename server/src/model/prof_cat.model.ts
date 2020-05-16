import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, JoinTable, ManyToMany } from "typeorm";
import ProfesionalExperience from "./prof_exp.model";

@Entity()
export default class ProfesionalCategory {
    @PrimaryGeneratedColumn({ name: 'cod_category' })
    public codCategory?: number;

    @Column()
    public name: string;

    @Column()
    public description: string;

    @CreateDateColumn({ name: 'created_at', update: false })
    public createdDate?: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    public updateDate?: Date;

    @ManyToMany(type => ProfesionalExperience, exp => exp.categories)
    experiences?: ProfesionalExperience[];

    constructor(name: string, description: string) {
        this.name= name,
        this.description = description
    }
}