import { json } from '@sveltejs/kit';
import { COOKIE_NAME } from '$env/static/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies, locals }) => {
	cookies.delete(COOKIE_NAME, { path: '/' });
	locals.user = null;
	return json({ success: true });
};
