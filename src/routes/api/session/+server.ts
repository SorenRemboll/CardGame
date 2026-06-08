import { json } from '@sveltejs/kit';
import { COOKIE_NAME } from '$env/static/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies, locals }) => {

	if (!locals.user) {
		return json({ sessionId: null }, { status: 401 });
	}
	const sessionId = cookies.get(COOKIE_NAME) ?? null;
	return json({ sessionId });
};
