import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from './generated/prisma/client.js';
import cards from './aicards.json';

const {
	MYSQL_DATABASE_HOST,
	MYSQL_DATABASE_PORT,
	MYSQL_DATABASE_USER,
	MYSQL_DATABASE_PASSWORD,
	MYSQL_DATABASE_NAME
} = process.env;

if (!MYSQL_DATABASE_HOST || !MYSQL_DATABASE_PORT || !MYSQL_DATABASE_USER || !MYSQL_DATABASE_PASSWORD || !MYSQL_DATABASE_NAME) {
	console.error('Missing required environment variables. Check your .env file.');
	process.exit(1);
}

const adapter = new PrismaMariaDb({
	host: MYSQL_DATABASE_HOST,
	port: parseInt(MYSQL_DATABASE_PORT),
	user: MYSQL_DATABASE_USER,
	password: MYSQL_DATABASE_PASSWORD,
	database: MYSQL_DATABASE_NAME,
	allowPublicKeyRetrieval: true
});

const prisma = new PrismaClient({ adapter });

async function seed() {
	console.log(`Starting seed: ${cards.length} cards...`);
	console.log(`Database: ${MYSQL_DATABASE_NAME}@${MYSQL_DATABASE_HOST}:${MYSQL_DATABASE_PORT}\n`);

	let imported = 0;
	let skipped = 0;

	for (const card of cards) {
		try {
			await prisma.cardData.upsert({
				where: { name: card.name },
				update: {
					description: card.description,
					siege: card.siege,
					spirit_cost: card.spirit_cost,
					health: card.health
				},
				create: {
					name: card.name,
					description: card.description,
					siege: card.siege,
					type: 'CREATURE',
					spirit_cost: card.spirit_cost,
					health: card.health,
					bastion: Math.floor(Math.random() * 15) + 1
				}
			});
			imported++;
			console.log(`✓ ${card.name}`);
		} catch (error) {
			skipped++;
			console.error(`✗ ${card.name}:`, error instanceof Error ? error.message : error);
		}
	}

	console.log(`\n✅ Seed complete: ${imported} imported, ${skipped} skipped`);
}

seed()
	.catch(console.error)
	.finally(() => prisma.$disconnect());
