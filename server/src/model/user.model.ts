import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { SexType } from '../interface/db.interface';
import Notification  from './notification.model'
import ProfesionalExperience from "./prof_exp.model";
import Contract from "./contract.model";

@Entity()
export default class User {
    @PrimaryGeneratedColumn({ name: 'cod_user' })
    public codUser?: number;

    @Column({ name: 'user_name' })
    public userName: string;

    @Column({ name: 'last_name' })
    public lastName: string;

    @Column()
    public email: string;

    @Column()
    public dni: string;

    @Column()
    public telf: string;

    @Column()
    public age: number;

    @Column({ type: 'enum', enum: SexType })
    public sex: string;

    @Column()
    public password: string;

    @Column({ name: 'postal_code' })
    public postalCode: number;

    @Column()
    public city: string;

    @Column()
    public region: string;
    
    @Column()
    public address: string;

    @Column({ nullable: true })
    public bio: string;

    @Column({ default: false })
    public offer: boolean;

    @Column({ nullable: true })
    public photo: string;

    @Column({ nullable: true })
    public lastLogin: Date;

    @CreateDateColumn({ name: 'created_at', update: false })
    public createdDate?: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    public updateDate?: Date;

    @OneToMany(type => Notification, notification => notification.user) 
    notifications?: Notification[];

    @OneToMany(type => ProfesionalExperience, experience => experience.user)
    experience?: ProfesionalExperience[];

    @OneToMany(type => Contract, contract => contract.worker)
    worker_contract?: Contract[];

    @OneToMany(type => Contract, contract => contract.contractor)
    contractor_contract?: Contract[];

    constructor(userName: string, lastName: string, email: string, dni: string, telf: string, age: number, sex: SexType, 
        password: string, postalCode: number, city: string, region: string, address: string, bio: string, offer: boolean, 
        photo: string, lastLogin: Date ) {
        this.userName = userName,
        this.lastName = lastName,
        this.email = email,
        this.dni = dni,
        this.telf = telf,
        this.age = age,
        this.sex = sex,
        this.password = password,
        this.postalCode = postalCode,
        this.city = city,
        this.region = region,
        this.address = address,
        this.bio = bio,
        this.offer = offer,
        this.photo = photo,
        this.lastLogin = lastLogin
    }

    public static describe(): string[] {
        return ['codUser', 'userName', 'lastName', 'email', 'dni', 'telf', 'age', 'sex', 'password', 'postalCode', 
            'city', 'region', 'address', 'bio', 'offer', 'photo', 'lastLogin']
    }
}