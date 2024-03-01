import { MigrationInterface, QueryRunner, getRepository } from "typeorm";
import { seatSeeds } from "db/seeds/seat.seeds";
import { movieSeeds } from "db/seeds/movie.seeds";
import { genreSeeds } from "db/seeds/genre.seeds";
import { auditoriumSeeds } from "db/seeds/auditorium.seeds";
import { userSeeds } from "db/seeds/user.seeds";
import { Auditorium } from "src/entities/auditorium.entity";

export class SeedDatabase1708514411113 implements MigrationInterface {
    name = 'SeedDatabase1708514411113'


    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager
            .getRepository('Seat')
            .save(seatSeeds);

        await queryRunner.manager
            .getRepository('Auditorium')
            .save(auditoriumSeeds);

        await queryRunner.manager
            .getRepository('Genre')
            .save(genreSeeds);

        await queryRunner.manager
            .getRepository('Movie')
            .save(movieSeeds);

        const genres = await queryRunner.manager.getRepository('Genre').find();
        const movies = await queryRunner.manager.getRepository('Movie').find()

        for (const movie of movies) {
            const numberOfGenresToAssociate = Math.floor(Math.random() * genres.length) + 1;
            const randomGenres = this.getRandomElements(genres, numberOfGenresToAssociate);

            for (const genre of randomGenres) {
                await queryRunner.query(
                    `INSERT INTO genre_movies_movie VALUES (${genre.id}, ${movie.id})`
                );
            }
        }

        await queryRunner.manager
            .getRepository('User')
            .save(userSeeds);
    }

    public async down(queryRunner: QueryRunner): Promise<void> { }

    public getRandomElements<T>(array: T[], count: number): T[] {
        const shuffled = array.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

}
