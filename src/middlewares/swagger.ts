import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { API_VERSION, APP_PORT } from '../config';

const definition = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Express JS Boilerplate API',
            version: '0.1.0',
            description: 'This is a simple CRUD API application made with Express and documented with Swagger',
            license: {
                name: 'MIT',
                url: 'https://spdx.org/licenses/MIT.html',
            },
            contact: {
                name: 'Adriana Eka Prayudha',
                url: 'https://radenadri.xyz',
                email: 'radenadriep@gmail.com',
            },
        },
        servers: [
            {
                url: `http://localhost:${APP_PORT}/api/${API_VERSION}`,
            },
        ],
    },
    apis: ['**/*.ts'],
};

const specs = swaggerJsdoc(definition);
export { specs, swaggerUi };
