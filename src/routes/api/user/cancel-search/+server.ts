import { prisma } from "$lib/prisma";
import { GameState } from "@prisma-app/client";
import { error, json, type RequestHandler } from "@sveltejs/kit"

export const POST: RequestHandler = async ({ request, locals }) => {
    
    if (!locals.user) {
        return error(401, "User not authenticated");
    }
    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: locals.user.id,
            },
            data: {
                GameState: GameState.IDLE
            }
        });
        if (!updatedUser) {
            return json({
                success: false,
                message: "Failed to cancep search"
            }, { status: 500 });
        }
        return json({
            success: true,
            state: updatedUser.GameState,
        });
    } catch (e) {
        console.log(e);
        
        return error(500, {
            message: "Failed to cancel search"
        });
    }
};