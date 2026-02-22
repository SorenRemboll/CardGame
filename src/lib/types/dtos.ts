import type { CardType } from '@prisma-app/client';

/** Card in deck context: Prisma CardData shape + quantity */
export type CardDTO = {
	id: number;
	name: string;
	type: CardType;
	description: string;
	siege: number;
	bastion: number;
	spirit_cost: number;
	health: number;
	quantity: number;
};

/** Minimal card shape for deck display (Card class or CardDTO) */
export type CardInDeck = Pick<
	CardDTO,
	'id' | 'name' | 'type' | 'description' | 'siege' | 'bastion' | 'spirit_cost'
>;

/** Deck with cards for display/transfer (not raw Prisma) */
export type DeckDTO = {
	id: number;
	name: string;
	description: string;
	cards: CardDTO[];
};

/** Deck metadata only (no cards) - for lists, selects, etc. */
export type DeckWithoutCards = Pick<DeckDTO, 'id' | 'name' | 'description'>;

/** User shape for client (omits password, sessionID) */
export type UserDTO = {
	id: number;
	userName: string;
	gameState: import('@prisma-app/client').GameState;
};
