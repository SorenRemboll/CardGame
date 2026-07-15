import tailwindcss from '@tailwindcss/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import type { Plugin } from 'vite';

/** Vitest 4 + Kit remotes SSR-eval client fetcher; stub window so that load doesn't explode. */
function vitestRemoteWindowShim(): Plugin {
	return {
		name: 'vitest-remote-window-shim',
		config() {
			if (!process.env.VITEST || typeof globalThis.window !== 'undefined') return;
			const win = {
				fetch: globalThis.fetch.bind(globalThis),
				location: new URL('http://localhost'),
				history: {
					length: 0,
					scrollRestoration: 'auto' as ScrollRestoration,
					state: null,
					back() {},
					forward() {},
					go() {},
					pushState() {},
					replaceState() {}
				},
				matchMedia: (media: string) => ({
					matches: false,
					media,
					onchange: null,
					addListener() {},
					removeListener() {},
					addEventListener() {},
					removeEventListener() {},
					dispatchEvent: () => true
				}),
				scrollTo() {}
			};
			Object.assign(globalThis, { window: win, location: win.location, history: win.history });
		}
	};
}

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		port: 3000
	},
	test: {
		projects: [
			{
				extends: './vite.config.ts',
				plugins: [svelteTesting(), vitestRemoteWindowShim()],
				test: {
					name: 'client',
					environment: 'jsdom',
					clearMocks: true,
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**'],
					setupFiles: ['./vitest-setup-client.ts']
				}
			},
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
