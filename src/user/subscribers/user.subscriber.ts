import { User } from 'src/entities/user.entity';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

// Ovaj subscriber koji je zapravo koncept iz TypeORM-a, radi sa entitetom User
@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }
  // Ovaj metod bi trebalo da se izvrsava pre nego sto se entitet User sacuva u bazu
  // Tako je, ovaj metod radi kad se pozove endpoint iz UserController-a register
  beforeInsert(event: InsertEvent<User>): Promise<any> | void {
    event.entity.password = User.hashPassword(event.entity.password);
    console.log('SUBSCRIBER INSERT WORKS');
  }

  // Ovaj metod bi trebalo da se izvrsava pre nego sto se izmenjeni entitet User sacuva u bazu
  // Tako je, i ovo radi kad se pozove endpoint za update User-a
  beforeUpdate(event: UpdateEvent<User>): Promise<any> | void {
    if (event.entity.password !== event.databaseEntity.password) {
      event.entity.password = User.hashPassword(event.entity.password);
    }
    console.log('SUBSCRIBER UPDATE WORKS');
  }
}
