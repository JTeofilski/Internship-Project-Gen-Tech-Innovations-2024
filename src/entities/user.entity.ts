import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Ticket } from './ticket.entity';
import { UserTypeEnum } from 'src/enums/userType.enum';
import { compare as compareHash, hashSync as createHash } from 'bcryptjs';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: UserTypeEnum,
    default: UserTypeEnum.CUSTOMER,
  })
  userType: UserTypeEnum;

  @OneToMany(() => Ticket, (ticket) => ticket.user)
  tickets: Ticket[];

  async comparePassword(password: string): Promise<boolean> {
    if (this.password) {
      return await compareHash(password, this.password);
    } else {
      return false;
    }
  }

  public static hashPassword(value?: string): string | undefined {
    if (value) {
      const ROUNDS = 10;
      return createHash(value, ROUNDS);
    } else {
      return value;
    }
  }
}
