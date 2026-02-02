// hooks.server.ts
import { COOKIE_NAME } from '$env/static/private';
import { BATTLE_ROUTES, PROTECTED_ROUTES, ROUTES } from '$lib/consts/routes';
import { prisma } from '$lib/prisma';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve, }) => {
    // This is a workaround for the devtools issue
	if (event.url.pathname.startsWith('/.well-known/appspecific/com.chrome.devtools')) {return new Response(null, { status: 204 })}
    const { cookies } = event;
    const sessionId = cookies.get(COOKIE_NAME);    
    if(PROTECTED_ROUTES.some(route => event.url.pathname.startsWith(route))) {
        // If the route is protected and no session ID is found, redirect to the login page
        if (!sessionId) {
            return redirect(307, ROUTES.LOGIN);
        }
    }
    if (!sessionId) {        
        return await resolve(event);
    }
    const user = await prisma.user.findUnique({
        where:{
            sessionID: sessionId,
        }
    })
    if(user){
        // If user is found, attach it to the event
        const safeUserStats = {
            id: user.id,
            userName:user.userName,
            gameState: user.GameState,
        }
        event.locals.user = safeUserStats;
    }
    if(event.locals.user?.gameState === "SEARCHING" && !event.url.pathname.includes('/api/')){
        // If user is in searching state, send the user to the loading page
        if(!event.url.pathname.startsWith(ROUTES.LOADING)){  
            return redirect(307, ROUTES.LOADING);
        }
    }
    else if(event.locals.user?.gameState !== "IN_BATTLE" && BATTLE_ROUTES.some(route=> event.url.pathname.startsWith(route)) ){
        return redirect(307, ROUTES.CHARACTER_BATTLES)
    }

    return await resolve(event);
};