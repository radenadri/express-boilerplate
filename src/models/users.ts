import { pgTable, serial, text } from 'drizzle-orm/pg-core';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The user ID.
 *           example: 1
 *         name:
 *           type: string
 *           description: The user name.
 *           example: Abraham Wong
 *         email:
 *           type: string
 *           description: The user email.
 *           example: wong@example.com
 *         password_hash:
 *           type: string
 *           description: The user password.
 */
export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
});
