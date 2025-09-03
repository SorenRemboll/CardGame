import { DECK_SLOTS_CAP_AMOUNT } from "$lib/consts/User.consts";
import { DBClient } from "$lib/prisma";
import { error, json, type RequestHandler } from "@sveltejs/kit"
import type { CardMetaData } from "@prisma-app/client";

export const POST:RequestHandler = async ({request,locals}) => {
    const {name,description,cards}:{name:string,description:string,cards:CardMetaData[]} = await request.json();
    if(!locals.user){
        return json({
            success:false,
            message:"User not authenticated"
        }, {status:401});
    }
    if(!name){
        return json({
            success: false,
            message: "Deck name is required"
        }, {status: 400});
    }
    if(!description){
        return json({
            success: false,
            message: "Deck description is required"
        }, {status: 400});
    }
    if(cards.length === 0 || cards.length > 30) {
        return json({
            success: false,
            message: "Deck must contain between 1 and 30 cards"
        }, {status: 400});
    }
    const isUserAllowedToCreateDeck = await DBClient.deck.count({
        where:{
            userId: locals.user.id,
        }
    }) <= DECK_SLOTS_CAP_AMOUNT;
    if(!isUserAllowedToCreateDeck){
        return json({
            success: false,
            message: "Deck slots are full"
        }, {status: 400});
    }
    try {
        const deck = await DBClient.deck.create({
            data: {
                name,
                description,
                userId: locals.user.id,
                cards: {
                    connect: cards.map(card => ({id: card.id}))
                }
            },
            omit:{
                time_created: true,
                time_updated: true,
            }
        });
        
        if (!deck) {
            return json({
                success: false,
                message: "Failed to create deck"
            }, {status: 500});
        }
        return json({
            success: true,
            deck,
        });
    }catch (e) {
        
        return error(500, {
            message: "Failed to create deck"
        });
    }
};