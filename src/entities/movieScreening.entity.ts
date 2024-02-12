import { timeStamp } from "console";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Movie } from "./movie.entity";
import { Auditorium } from "./auditorium.entity";
import { Ticket } from "./ticket.entity";

@Entity()
export class MovieScreening {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "date" })
    date: string

    @Column({ type: "time" })
    startTime: string

    @Column()
    isDeleted: boolean = false

    @ManyToOne(() => Movie, movie => movie.movieScreenings, { onDelete: 'SET NULL' })
    movie: Movie

    @ManyToOne(() => Auditorium, auditorium => auditorium.movieScreenings, { onDelete: 'SET NULL' })
    auditorium: Auditorium

    @OneToMany(() => Ticket, ticket => ticket.movieScreening)
    tickets: Ticket[]
}