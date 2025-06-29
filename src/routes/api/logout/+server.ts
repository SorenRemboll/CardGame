import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { COOKIE_NAME } from '$env/static/private';

export const POST: RequestHandler = ({ cookies,locals }) => {
    // Clear the session cookie
    cookies.delete(COOKIE_NAME, {path: '/'});
    locals.user = null; // Clear the user session in locals
	return json({
        success: true,
        message: 'Logout successful',
    })
};