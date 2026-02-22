import { goto } from '$app/navigation';
import { ROUTES } from '$lib/consts/routes';
import { DECK_SIZE } from '$lib/consts/User.consts';
import type { CardDTO, DeckDTO } from '$lib/types';
import { playerState } from '$lib/state/Player.state.svelte';
import { saveDeck } from '$lib/remote/decks.remote';
import { Card } from '../cards/Card.data.svelte';

type SaveDeckResult = {
	success: boolean;
	deck: {
		id: number;
		name: string;
		description: string;
		cards: (CardDTO & { quantity?: number })[];
	};
};

export class Deck {
    private _id: number = $state(0);
    name: string = $state("");
    description: string = $state("");
    cards: Card[] = $state([]);

    get id() {
        return this._id;
    }

    // Get total card count (including duplicates)
    get totalCards() {
        return this.cards.length;
    }

    addCardToDeck = (card: Card) => {
        if (this.cards.length >= DECK_SIZE) {
            alert("Deck is full, you can only have " + DECK_SIZE + " cards in a deck.");
            return;
        }
        if (this.cards.filter(c => c.id === card.id).length >= 2) {
            alert("You already have this card in your deck twice.");
            return;
        }
        this.cards.push(card);
    };

    removeCardFromDeck = (card: Card) => {
        const index = this.cards.findIndex(c => c.id === card.id);
        if (index !== -1) {
            this.cards.splice(index, 1);
        }
    };

	constructor(init: { id?: number; name?: string; description?: string; cards?: Card[] } = {}) {
		this._id = init.id || 0;
		this.name = init.name || '';
		this.description = init.description || '';
		this.cards = init.cards || [];
	}

	/** Create Deck from DTO; expands cards by quantity into Card[] */
	static fromDTO(dto: DeckDTO): Deck {
		const cards = dto.cards.flatMap((cardDto) =>
			Array.from({ length: cardDto.quantity }, () => Card.fromDTO(cardDto))
		);
		return new Deck({
			id: dto.id,
			name: dto.name,
			description: dto.description,
			cards
		});
	}

	/** Convert to DTO (groups cards by id with quantity) */
	toDTO(): DeckDTO {
		const cardCounts = this.cards.reduce(
			(acc, card) => {
				acc[card.id] = (acc[card.id] || 0) + 1;
				return acc;
			},
			{} as Record<number, number>
		);
		const cards: CardDTO[] = [];
		const seen = new Set<number>();
		for (const card of this.cards) {
			if (!seen.has(card.id)) {
				seen.add(card.id);
				cards.push(card.toDTO(cardCounts[card.id] ?? 1) as CardDTO);
			}
		}
		return {
			id: this._id,
			name: this.name,
			description: this.description,
			cards
		};
	}

    // Convert cards array to grouped format for API
    private getCardsForApi() {
        const cardCounts = this.cards.reduce((acc, card) => {
            acc[card.id] = (acc[card.id] || 0) + 1;
            return acc;
        }, {} as Record<number, number>);

        return Object.entries(cardCounts).map(([cardId, quantity]) => ({
            cardId: parseInt(cardId),
            quantity
        }));
    }

    async save() {
        console.log("Saving deck:", this.cards);

        try {
            const result = await saveDeck({
                id: this.id || undefined,
                name: this.name,
                description: this.description,
                cards: this.getCardsForApi()
            }) as SaveDeckResult;

			const deckInstance = Deck.fromDTO(result.deck as DeckDTO);

			alert('Deck saved successfully!');
			playerState.setDeck(deckInstance);
			goto(ROUTES.CHARACTER_DECK(result.deck.id));
        } catch (e) {
            const error = e as Error;
            alert("Error saving deck: " + error.message);
        }
    }
}
