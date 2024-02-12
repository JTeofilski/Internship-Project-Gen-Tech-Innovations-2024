import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, VirtualColumn } from "typeorm";
import { Auditorium } from "./auditorium.entity";
import { Ticket } from "./ticket.entity";

@Entity()
export class Seat {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    row: number

    @Column()
    column: number

    @ManyToOne(() => Auditorium, auditorium => auditorium.seats, { onDelete: 'SET NULL' })
    auditorium: Auditorium

    @OneToMany(() => Ticket, ticket => ticket.seat)
    tickets: Ticket[]

    get isOccupied(): boolean {
        let result;

        this.auditorium.movieScreenings.forEach(ms => {
            ms.tickets.forEach(t => {
                result = !!this.tickets.find(ticket => ticket.movieScreening.id === t.movieScreening.id);
            });
        });
        return result
    }



}
