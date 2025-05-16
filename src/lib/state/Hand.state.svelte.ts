import type { Card } from "$lib/types/Game";

export class HandState {
  private _cards: Card[] = $state([]);

  constructor(intialCards: Card[] = []) {
    this._cards = intialCards;
  }

  get cards(): Card[] {
    return this._cards;
  }

  set cards(value: Card[]) {
    this._cards = value;
  }

  addCard(card: Card): void {
    this._cards.push(card);
  }

  removeCard(card: Card): void {
    const index = this._cards.indexOf(card);
    if (index > -1) {
      this._cards.splice(index, 1);
    }
  }
}
