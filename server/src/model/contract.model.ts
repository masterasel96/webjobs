import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import User from './user.model';
import { ContractStatus } from '../interface/db.interface';

@Entity()
export default class Contract {
    @PrimaryGeneratedColumn({ name: 'cod_contract' })
    public codContract?: number;

    @ManyToOne(type => User, user => user.worker_contract)
    @JoinColumn({ name: "cod_worker" })
    public worker: User;

    @ManyToOne(type => User, user => user.contractor_contract)
    @JoinColumn({ name: "cod_contractor" })
    public contractor: User;

    @Column({ name: 'start_date', nullable: true })
    public startDate?: Date;

    @Column({ name: 'end_date', nullable: true })
    public endDate?: Date;

    @Column({ default: ContractStatus.PENDING })
    public status?: ContractStatus;

    @Column({ name: 'contractor_assessment', nullable: true })
    public contractorAssessment?: string;

    @Column({ name: 'worker_assessment', nullable: true })
    public workerAssessment?: string;

    @Column({ name: 'contractor_punctuation', nullable: true })
    public contractorPunctuation?: string;

    @Column({ name: 'worker_punctuation', nullable: true })
    public workerPunctuation?: string;

    @CreateDateColumn({ name: 'created_at', update: false })
    public createdDate?: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    public updateDate?: Date;

    constructor(worker: User, contractor: User){
        this.worker= worker,
        this.contractor = contractor
    }
}