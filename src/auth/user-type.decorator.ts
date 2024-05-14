import { SetMetadata } from '@nestjs/common';
import { UserTypeEnum } from 'src/enums/userType.enum';

// U pitanju je custom dekorator - UserType
// Tipa je UserTypeEnum
// Funkcija SetMetadata, kako sam naziv kaze, podesava, u ovom slucaju, metapodatak('userType') na vrednost koju ima type
// Funkcija SetMetadata, prima parametre u kljuc-vrednost stilu, gde je kod nas, 'userType' kljuc, a type predstavlja vrednost
export const UserType = (type: UserTypeEnum) => SetMetadata('userType', type);
