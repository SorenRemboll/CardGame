import "dotenv/config";
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@DBG';
import { MYSQL_DATABASE_HOST } from '$env/static/private';
import { MYSQL_DATABASE_PORT } from '$env/static/private';
import { MYSQL_DATABASE_USER } from '$env/static/private';
import { MYSQL_DATABASE_PASSWORD } from '$env/static/private';
import { MYSQL_DATABASE_NAME } from '$env/static/private';

const adapter = new PrismaMariaDb({
    host: MYSQL_DATABASE_HOST,
    port: parseInt(MYSQL_DATABASE_PORT),
    user: MYSQL_DATABASE_USER,
    password: MYSQL_DATABASE_PASSWORD,
    database: MYSQL_DATABASE_NAME,
    allowPublicKeyRetrieval: true,
});
const prisma = new PrismaClient({ adapter });

export { prisma }