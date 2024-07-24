import adapter from "@sveltejs/adapter-netlify";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import dotenv from "dotenv";

dotenv.config({ path: "./.env.local" });
dotenv.config({ path: "./.env" });

process.env.PUBLIC_VERSION ??= process.env.npm_package_version;

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			edge: true,

			// if true, will split your app into multiple functions
			// instead of creating a single one for the entire app.
			// if `edge` is true, this option cannot be used
			// split: false,
		}),

		paths: {
			base: process.env.APP_BASE || "",
		},
		csrf: {
			// handled in hooks.server.ts, because we can have multiple valid origins
			checkOrigin: false,
		},
	},
};

export default config;
