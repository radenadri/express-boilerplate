import { eq } from 'drizzle-orm';

import db from '../../db';
import { users } from '../../models/users';
import { getUser, registerUser, verifyLogin } from '../../routes/auth/repository';

test('getUser(email: string) should return user', () => {
    getUser('k4F3N@example.com').then(user => expect(user?.email).toBe('k4F3N@example.com'));
});

test('verifyLogin(email: string, password: string) should return user', () => {
    verifyLogin('k4F3N@example.com', 'password').then(user => expect(user?.email).toBe('k4F3N@example.com'));
});

test('registerUser(email: string, password: string, name: string) should return user', () => {
    registerUser('k4F3N@example.com', 'password', 'name');

    db.select()
        .from(users)
        .where(eq(users.email, 'k4F3N@example.com'))
        .then(res => {
            expect(res[0].email).toBe('k4F3N@example.com');
        });
});
