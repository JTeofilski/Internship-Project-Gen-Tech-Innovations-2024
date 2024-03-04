import { User } from 'src/entities/user.entity';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  beforeInsert(event: InsertEvent<User>): Promise<any> | void {
    event.entity.password = User.hashPassword(event.entity.password);
    console.log('SUBSCRIBER WORKS');
  }
}
