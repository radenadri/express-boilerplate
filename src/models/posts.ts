import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';

import { users } from './users';

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The post ID.
 *           example: 1
 *         title:
 *           type: string
 *           description: The post title.
 *           example: Hello World
 *         body:
 *           type: string
 *           description: The post body.
 *           example: This is my first post
 *         user_id:
 *           type: integer
 *           description: The user ID.
 *           example: 1
 */
export const posts = pgTable('posts', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    body: text('body').notNull(),
    userId: integer('user_id').references(() => users.id),
});
