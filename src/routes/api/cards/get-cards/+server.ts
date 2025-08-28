import { importScript } from "$lib/import";
import { DBClient } from "$lib/prisma";
import { error, json, type RequestHandler } from "@sveltejs/kit"

export const POST:RequestHandler = async ({request,locals}) => {
    const {card_ids}:{card_ids:number[]} = await request.json();
    if (!locals.user) {
        return json({
            success:false,
            message:"User not authenticated"
        }, {status:401});
    }
    let cards = null;
    try{
        if(card_ids.length === 0){
            // Fetch all cards if no IDs are provided
            cards = await DBClient.cardMetaData.findMany({
                omit:{
                    time_created: true,
                    time_updated: true,
                },
                orderBy:{
                    spirit_cost: 'asc',
                }
                
            });
        }else{
             cards = await DBClient.cardMetaData.findMany({
                omit:{
                    time_created: true,
                    time_updated: true,
                },
                where:{
                    id:{
                        in: card_ids,
                    }
                }
            });
        }

        
    } catch (e) {
        
        return error(500,{
            message: "Failed to fetch cards"
        });
    } 
    return json({
        success:true,
        cards: cards
    })
};