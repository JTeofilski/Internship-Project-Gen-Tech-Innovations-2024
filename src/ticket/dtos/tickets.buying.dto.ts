import { IsArray, IsInt, IsNotEmpty } from 'class-validator';

export default class TicketsBuyingDTO {
  @IsNotEmpty()
  @IsInt()
  movieScreeningId: number;

  @IsNotEmpty()
  @IsArray()
  @IsInt({ each: true })
  seatIds: number[];
}
