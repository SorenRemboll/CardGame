import type { CardType } from '@prisma-app/client';
import type { CardDTO } from '$lib/types';

export type CardInit = {
	id: number;
	name: string;
	type: CardType | null;
	description: string;
	siege: number;
	bastion: number;
	spirit_cost: number;
};

export class Card {
	public name = '';
	public type: CardType | null = null;
	public description = '';
	public siege = 0;
	public bastion = 0;
	public spirit_cost = 0;
	public id: number = 0;

	constructor(init: Partial<CardInit> = {}) {
		this.id = init.id ?? 0;
		this.name = init.name ?? '';
		this.type = init.type ?? null;
		this.description = init.description ?? '';
		this.siege = init.siege ?? 0;
		this.bastion = init.bastion ?? 0;
		this.spirit_cost = init.spirit_cost ?? 0;
	}

	/** Create Card from DTO (strips quantity, health) */
	static fromDTO(dto: CardDTO): Card {
		return new Card({
			id: dto.id,
			name: dto.name,
			type: dto.type,
			description: dto.description,
			siege: dto.siege,
			bastion: dto.bastion,
			spirit_cost: dto.spirit_cost
		});
	}

	/** Convert to DTO shape (caller adds quantity) */
	toDTO(quantity = 1): Omit<CardDTO, 'quantity'> & { quantity: number } {
		return {
			id: this.id,
			name: this.name,
			type: this.type!,
			description: this.description,
			siege: this.siege,
			bastion: this.bastion,
			spirit_cost: this.spirit_cost,
			health: 0,
			quantity
		};
	}

	onPlay() {
		console.log(this.name + ' card played!');
	}
}