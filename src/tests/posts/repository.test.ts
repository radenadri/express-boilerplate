import db from '../../db';
import { posts } from '../../models/posts';
import {
    createPost,
    deletePost,
    getAllPosts,
    getPost,
    getPostsByUser,
    updatePost,
} from '../../routes/posts/repository';

test('getAllPosts() should return posts', () => {
    getAllPosts().then(posts => expect(posts.length).toBeGreaterThan(0));
});

test('getPost(postId: number) should return post', () => {
    getPost(1).then(post => expect(post?.id).toBe(1));
});

test('getPostsByUser(userId: number) should return posts', () => {
    getPostsByUser(1).then(posts => expect(posts.length).toBeGreaterThan(0));
});

test('createPost(title: string, body: string, userId: number) should return post', () => {
    createPost('title', 'body', 1);

    db.select()
        .from(posts)
        .then(res => {
            expect(res[0].title).toBe('title');
            expect(res[0].body).toBe('body');
            expect(res[0].userId).toBe(1);
        });
});

test('updatePost(body: string, userId: number, postId: number) should return post', () => {
    updatePost('body', 1, 1);

    db.select()
        .from(posts)
        .then(res => {
            expect(res[0].body).toBe('body');
        });
});

test('deletePost(postId: number, userId: number) should delete post', () => {
    deletePost(1, 1);
    db.select()
        .from(posts)
        .then(res => expect(res.length).toBe(0));
});
