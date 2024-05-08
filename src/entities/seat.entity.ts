import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Auditorium } from './auditorium.entity';
import { Ticket } from './ticket.entity';
import { Expose } from 'class-transformer';

@Entity()
export class Seat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  row: number;

  @Column()
  column: number;

  @Column()
  auditoriumId: number;

  @Column({ default: 1 })
  percentage: number;

  @ManyToOne(() => Auditorium, (auditorium) => auditorium.seats, {
    onDelete: 'SET NULL',
  })
  auditorium: Auditorium;

  @OneToMany(() => Ticket, (ticket) => ticket.seat)
  tickets: Ticket[];

  @Expose()
  get isOccupied(): boolean {
    return !!this.tickets?.length;
  }
}
