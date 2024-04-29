import { MigrationInterface, QueryRunner } from 'typeorm';
import { seatSeeds } from 'db/seeds/seat.seeds';
import { movieSeeds } from 'db/seeds/movie.seeds';
import { genreSeeds } from 'db/seeds/genre.seeds';
import { auditoriumSeeds } from 'db/seeds/auditorium.seeds';
import { userSeeds } from 'db/seeds/user.seeds';
import { Auditorium } from 'src/entities/auditorium.entity';
import { movieScreeningSeeds } from 'db/seeds/movie-screening.seeds';
import { ticketSeeds } from 'db/seeds/ticket.seeds';

export class SeedDatabase1714394440007 implements MigrationInterface {
  name = 'SeedDatabase1714394440007';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.getRepository('Auditorium').save(auditoriumSeeds);
    await queryRunner.manager.getRepository('User').save(userSeeds);

    await queryRunner.manager.getRepository('Genre').save(genreSeeds);

    await queryRunner.manager.getRepository('Movie').save(movieSeeds);

    const genres = await queryRunner.manager.getRepository('Genre').find();
    const movies = await queryRunner.manager.getRepository('Movie').find();

    for (const movie of movies) {
      const numberOfGenresToAssociate =
        Math.floor(Math.random() * genres.length) + 1;
      const randomGenres = this.getRandomElements(
        genres,
        numberOfGenresToAssociate,
      );

      for (const genre of randomGenres) {
        await queryRunner.query(
          `INSERT INTO genre_movies_movie VALUES (${genre.id}, ${movie.id})`,
        );
      }
    }

    const auditoriumRepository =
      queryRunner.manager.getRepository('Auditorium');
    const seatRepository = queryRunner.manager.getRepository('Seat');

    const auditoriums = await auditoriumRepository.find();

    const seatEntities = seatSeeds.map((seatSeed) => {
      const auditorium = auditoriums.find(
        (a) => a.id === seatSeed.auditoriumId,
      );

      return seatRepository.create({ ...seatSeed, auditorium });
    });

    await queryRunner.manager.getRepository('Seat').save(seatEntities);

    const movieScreeningRepository =
      queryRunner.manager.getRepository('MovieScreening');

    const movieScreeningEntities = movieScreeningSeeds.map((seed) => {
      const movie = movies.find((m) => m.id === seed.movieId);
      const auditorium = auditoriums.find((a) => a.id === seed.auditoriumId);

      return movieScreeningRepository.create({
        ...seed,
        movie,
        auditorium,
      });
    });

    await queryRunner.manager
      .getRepository('MovieScreening')
      .save(movieScreeningEntities);
    const ticketRepository = queryRunner.manager.getRepository('Ticket');

    const ticketEntities = ticketSeeds.map((ticketSeed) => {
      const movieScreening = movieScreeningEntities.find(
        (ms) => ms.id === ticketSeed.movieScreeningId,
      );
      const seat = seatEntities.find((s) => s.id === ticketSeed.seatId);
      const user = userSeeds.find((u) => u.id === ticketSeed.userId);

      return ticketRepository.create({
        ...ticketSeed,
        movieScreening,
        seat,
        user,
      });
    });

    await queryRunner.manager.getRepository('Ticket').save(ticketEntities);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM ticket;');
    await queryRunner.query('DELETE FROM movie_screening;');
    await queryRunner.query('DELETE FROM seat;');
    await queryRunner.query('DELETE FROM genre_movies_movie;');
    await queryRunner.query('DELETE FROM movie;');
    await queryRunner.query('DELETE FROM genre;');
    await queryRunner.query('DELETE FROM "user";');
    await queryRunner.query('DELETE FROM auditorium;');
  }

  public getRandomElements<T>(array: T[], count: number): T[] {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}
