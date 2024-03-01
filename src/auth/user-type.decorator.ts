import { SetMetadata } from '@nestjs/common';
import { UserTypeEnum } from 'src/enums/userType.enum';

export const UserType = (type: UserTypeEnum) => SetMetadata('userType', type);
