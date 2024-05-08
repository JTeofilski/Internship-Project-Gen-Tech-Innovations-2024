export class SeatDTO {
  seatId: number;
  seatRow: number;
  seatColumn: number;
  auditoriumId: number;
  movieId: number;
  moviescreeningId: number;
  percentage: number;
  originalMoviePrice: number;
  calculatedPrice: number;

  constructor(
    seatId,
    seatRow,
    seatColumn,
    auditoriumId,
    movieId,
    moviescreeningId,
    percentage,
    originalMoviePrice,
    calculatedPrice,
  ) {
    (this.seatId = seatId),
      (this.seatRow = seatRow),
      (this.seatColumn = seatColumn),
      (this.auditoriumId = auditoriumId),
      (this.movieId = movieId),
      (this.moviescreeningId = moviescreeningId),
      (this.percentage = percentage),
      (this.originalMoviePrice = originalMoviePrice),
      (this.calculatedPrice = calculatedPrice);
  }
}
