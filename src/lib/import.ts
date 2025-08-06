import Cars from '../../prisma/aicards.json'
import { DBClient } from "$lib/prisma";
export const importScript = async () => {

    for (const card of Cars) {
        try {
            await DBClient.cardMetaData.create({
                data: {
                    name: card.name,
                    description: card.description,
                    siege: card.siege,
                    type:'CREATURE',
                    spirit_cost: card.spirit_cost,
                    health: card.health,
                    bastion:Math.floor(Math.random() * 15) + 1,
                }
            });
        } catch (error) {
            console.error(`Error importing card ${card.name}:`, error);
        }
    }
}
