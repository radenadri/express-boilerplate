import express from 'express';

import { rateLimiterStrict } from '../../middlewares/rate-limiter';
import validate from '../../middlewares/validate-request';
import { getUser, registerUser, verifyLogin } from './repository';
import { loginSchema, registerSchema } from './schema';
import { createAccessToken, createRefreshToken, setRefreshCookie, verifyToken } from './utils';
const router = express.Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user and return the success message
 *     tags: [Auth]
 *     parameters:
 *       - in: header
 *         name: Content-Type
 *         schema:
 *           type: string
 *           default: application/json
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user name.
 *                 example: Abraham Wong
 *               email:
 *                 type: string
 *                 description: The user email.
 *                 example: wong@example.com
 *               password:
 *                 type: string
 *                 description: The user password.
 *                 example: Abcd1234
 *     responses:
 *       200:
 *           description: Successfully signed up
 *           content:
 *               application/json:
 *                   schema:
 *                     type: object
 *                     properties:
 *                       message:
 *                         type: string
 *                         description: The success message
 *                         example: Successfully signed up
 *       400:
 *           description: Something went wrong signing you up
 *           content:
 *               application/json:
 *                   schema:
 *                     type: object
 *                     properties:
 *                       error:
 *                         type: string
 *                         description: The error message
 *                         example: Something went wrong signing you up
 *       409:
 *           description: Someone with that email already exists
 *           content:
 *               application/json:
 *                   schema:
 *                     type: object
 *                     properties:
 *                       error:
 *                         type: string
 *                         description: The error message
 *                         example: Someone with that email already exists
 *
 */
router.post('/register', validate(registerSchema), rateLimiterStrict, async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const user = await getUser(email);
        if (user) return res.status(409).send({ error: 'Someone with that email already exists' });
        await registerUser(email, password, name);

        res.status(200).send({ message: 'Successfully signed up' });
    } catch (error) {
        res.status(400).send({ error: 'Something went wrong signing you up' });
    }
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     description: Login a user and return the access token
 *     tags: [Auth]
 *     parameters:
 *       - in: header
 *         name: Content-Type
 *         schema:
 *           type: string
 *           default: application/json
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user email.
 *                 example: wong@example.com
 *               password:
 *                 type: string
 *                 description: The user password.
 *                 example: Abcd1234
 *     responses:
 *       200:
 *           description: Successfully signed up
 *           content:
 *               application/json:
 *                   schema:
 *                     type: object
 *                     properties:
 *                       accessToken:
 *                         type: string
 *                         description: The access token
 *                         example: your-access-token
 *       400:
 *           description: Something went wrong signing you up
 *           content:
 *               application/json:
 *                   schema:
 *                     type: object
 *                     properties:
 *                       error:
 *                         type: string
 *                         description: The error message
 *                         example: Something went wrong logging you in
 *       401:
 *           description: Invalid email or password
 *           content:
 *               application/json:
 *                   schema:
 *                     type: object
 *                     properties:
 *                       error:
 *                         type: string
 *                         description: The error message
 *                         example: Invalid email or password
 *
 */
router.post('/login', validate(loginSchema), rateLimiterStrict, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await verifyLogin(email, password);
        if (!user) return res.status(401).send({ errror: 'Invalid email or password' });

        const accessToken = createAccessToken(user.id, user.email, user.name);
        const refreshToken = createRefreshToken(user.id, user.email, user.name);
        setRefreshCookie(res, refreshToken);

        res.status(200).send({ accessToken });
    } catch (error) {
        res.status(400).send({ error: 'Something went wrong logging you in' });
    }
});

/**
 * @swagger
 * /refresh:
 *   post:
 *     summary: Refresh a user access token
 *     description: Refresh a user access token and return the new access token
 *     tags: [Auth]
 *     parameters:
 *       - name: Content-Type
 *         in: header
 *         schema:
 *           type: string
 *           default: application/json
 *         required: true
 *       - name: Cookie
 *         in: header
 *         schema:
 *           type: string
 *           default: refreshToken=your-refresh-token
 *         required: true
 *     responses:
 *       200:
 *           description: Successfully refreshed
 *           content:
 *               application/json:
 *                   schema:
 *                     type: object
 *                     properties:
 *                       accessToken:
 *                         type: string
 *                         description: The access token
 *                         example: your-access-token
 *       400:
 *           description: Invalid refresh token
 *           content:
 *               application/json:
 *                   schema:
 *                     type: object
 *                     properties:
 *                       error:
 *                         type: string
 *                         description: The error message
 *                         example: Invalid refresh token
 *
 */
router.post('/refresh', async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const { id, email, name } = verifyToken(refreshToken);
        const accessToken = createAccessToken(id, email, name);
        res.status(200).send({ accessToken });
    } catch (error) {
        res.status(401).send({ error: 'Invalid refresh token' });
    }
});

export default router;
