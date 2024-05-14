import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/user/user.service';

// Jasno je da se nasledjuje klasa PassportSerializer
// Ova klasa se poziva iz AuthModule-a, tako sto je tamo navedena u providers sekciji
@Injectable()
export class SessionSerializer extends PassportSerializer {
  // U konstruktoru se kao parametar prosledjuje userService, koji se koristi u deserializeUser metodi
  // Takodje se u konstruktoru poziva super(), sto poziva konstruktor roditeljske klase, a to je PassportSerializer
  // Ako je konstruktor dete-klase eksplicitno napisan kao ovde, mora se eksplicitno pozvati super(), sto poziva konstruktor roditelj-klase
  // Ako konstruktor dete-klase nije eksplicitno napisan, onda se automatski poziva super() sto poziva konstruktor roditelj-klase, sto nije uvek dobro, jer mozda su potrebni argumenti
  constructor(private readonly userService: UserService) {
    super();
  }

  // User objekat, koji se prosledjuje kao argument je taj koji zelimo da sacuvamo u sesiji
  // done je callback f-ja(a to je f-ja koja se prosledjuje drugoj f-ji kao argument) i poziva se kad se serijalizacija zavrsi
  // done(null, user) znaci da se poziva f-ja done, da nema greske(null) i prosledjuje se user koji je proslednjen kao argument ovoj glavnoj f-ji
  // ...is saved in the session and is later used to retrieve the whole object via the deserializeUser function...
  serializeUser(
    user: User,
    done: (err: Error, user: { id: number }) => void,
  ): any {
    done(null, { id: user.id });
  }

  // The first argument of deserializeUser corresponds to the key of the user object that was given to the done function(mi smo stavili samo id)
  // That key can be any key of the user object i.e. name, email etc.
  // In deserializeUser that key is matched with the in memory array / database or any data resource
  // The fetched object is attached to the request object as req.user
  async deserializeUser(
    payload: { id: number },
    done: (err: Error, user: User) => void,
  ): Promise<any> {
    try {
      //console.log(payload);
      const user = await this.userService.findOneById(payload.id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
}
