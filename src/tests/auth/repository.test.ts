import { getUser } from '../../routes/auth/repository';

test('getUser(email: string) should return user', async () => {
    const user = await getUser('k4F3N@example.com');
    expect(user).toEqual({ id: 1, email: 'k4F3N@example.com', name: 'John Doe' });
});
