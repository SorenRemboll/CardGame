// hooks.server.ts
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve, }) => {
    // This is a workaround for the devtools issue
	if (event.url.pathname.startsWith('/.well-known/appspecific/com.chrome.devtools')) {return new Response(null, { status: 204 })}

    return await resolve(event);
};