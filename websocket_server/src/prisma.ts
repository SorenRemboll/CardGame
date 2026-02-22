import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../../prisma/generated/prisma/client.js';

// Get env vars from Bun
const {
    MYSQL_DATABASE_HOST = 'mysql',  // 'mysql' is the docker service name
    MYSQL_DATABASE_PORT = '3306',
    MYSQL_DATABASE_USER = 'local',
    MYSQL_DATABASE_PASSWORD = 'local',
    MYSQL_DATABASE_NAME = 'CardGame'
} = process.env;

const adapter = new PrismaMariaDb({
    host: MYSQL_DATABASE_HOST,
    port: parseInt(MYSQL_DATABASE_PORT),
    user: MYSQL_DATABASE_USER,
    password: MYSQL_DATABASE_PASSWORD,
    database: MYSQL_DATABASE_NAME,
    allowPublicKeyRetrieval: true,
});

export const prisma = new PrismaClient({ adapter });
