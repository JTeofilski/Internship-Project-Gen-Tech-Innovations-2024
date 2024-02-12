import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Movie } from "./movie.entity";

@Entity()
export class Genre {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    name: string

    @Column()
    isDeleted: boolean = false

    @ManyToMany(() => Movie, movie => movie.genres)
    @JoinTable()
    movies: Movie[]
}