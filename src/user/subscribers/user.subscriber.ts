import { User } from 'src/entities/user.entity';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
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

  beforeUpdate(event: UpdateEvent<User>): Promise<any> | void {
    console.log('SUBSCRIBER UPDATE WORKS');
    if (event.entity.password !== event.databaseEntity.password) {
      event.entity.password = User.hashPassword(event.entity.password);
    }
  }
}
