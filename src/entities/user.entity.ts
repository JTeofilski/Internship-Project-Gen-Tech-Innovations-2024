import { Usertype } from "src/enums/userType.enum";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Ticket } from "./ticket.entity";


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    fullName: string

    @Column()
    email: string

    @Column()
    password: string

    @Column()
    userType: Usertype

    @OneToMany(() => Ticket, ticket => ticket.user)
    tickets: Ticket[]


}