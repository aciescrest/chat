import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import Icons from 'unplugin-icons/vite';


export default defineConfig({
	plugins: [
		sveltekit(),
		Icons({
			compiler: 'svelte',
		})
	],
	optimizeDeps: {
		include: ["browser-image-resizer", "uuid", "@xenova/transformers"],
		esbuildOptions: {
			target: "es2023",
		},
	},
	build: {
		rollupOptions: {
		  external: [
			"@anthropic-ai/vertex-sdk",
		  ],
		},
	  },
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
