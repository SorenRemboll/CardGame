// hooks.server.ts
import { COOKIE_NAME } from '$env/static/private';
import { PROTECTED_ROUTES, ROUTES } from '$lib/consts/routes';
import { DBClient } from '$lib/prisma';
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
        // If no session ID is found, redirect to the login page
        return await resolve(event);
    }
    if(event.locals.user){
        // If user is already set in locals, no need to fetch again
        return await resolve(event);
    }
    const user = await DBClient.user.findUnique({
        where:{
            sessionID: sessionId,
        }
    })
    if(user){
        // If user is found, attach it to the event
        const safeUserStats = {
            id: user.id,
            userName:user.userName
        }
        event.locals.user = safeUserStats;
    }

    return await resolve(event);
};