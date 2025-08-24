import type { CardType } from "@prisma-app/client"
export class Card{
    //Inject card effect
    public name = "";
    public type: CardType | null = null;
    public description = "";
    public siege = 0;
    public bastion = 0;
    public spirit_cost = 0;
    public id: number = 0;
    constructor({
        id = 0,
        name = "",
        type = null,
        description = "",
        siege = 0,
        bastion = 0,
        spirit_cost = 0
    }:{id:number,name: string, type: CardType | null, description: string, siege: number, bastion: number, spirit_cost: number}) {
        this.name = name;
        this.id = id;
        this.type = type;
        this.description = description;
        this.siege = siege;
        this.bastion = bastion;
        this.spirit_cost = spirit_cost;
    }
    onPlay(){
        console.log(this.name + ' card played!');
    }
}