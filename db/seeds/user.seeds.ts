import * as bcrypt from 'bcrypt';

export const userSeeds = [
  {
    id: 1,
    fullName: 'test1',
    email: 'test1@test1.com',
    password: hashPassword('test1'),
    userType: 'ADMIN',
  },
  {
    id: 2,
    fullName: 'test2',
    email: 'test2@test2.com',
    password: hashPassword('test2'),
    userType: 'CUSTOMER',
  },
];

function hashPassword(password: string): string {
  const saltRounds = 10; // 10 rundi
  return bcrypt.hashSync(password, saltRounds);
}
