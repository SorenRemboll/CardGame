import {CardType} from "@prisma-app/client"
import { Card } from "../BaseCard";
export class Soldier extends Card {
    constructor(){
        super({
            name: "Soldier",
            type: CardType.CREATURE,
            description: "A brave soldier ready to fight for his cause.",
            siege: 2,
            bastion: 3,
            spirit_cost: 2
        });
    }
   
}