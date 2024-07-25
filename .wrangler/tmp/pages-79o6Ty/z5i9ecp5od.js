// <define:__ROUTES__>
var define_ROUTES_default = {
	version: 1,
	description: "Generated by @sveltejs/adapter-cloudflare",
	include: ["/*"],
	exclude: ["/_app/*", "/favicon.png"],
};

// ../../.nvm/versions/node/v20.15.0/lib/node_modules/wrangler/templates/pages-dev-pipeline.ts
import worker from "/home/res/dev/acchat/.wrangler/tmp/pages-79o6Ty/bundledWorker-0.030875075860372636.mjs";
import { isRoutingRuleMatch } from "/home/res/.nvm/versions/node/v20.15.0/lib/node_modules/wrangler/templates/pages-dev-util.ts";
export * from "/home/res/dev/acchat/.wrangler/tmp/pages-79o6Ty/bundledWorker-0.030875075860372636.mjs";
var routes = define_ROUTES_default;
var pages_dev_pipeline_default = {
	fetch(request, env, context) {
		const { pathname } = new URL(request.url);
		for (const exclude of routes.exclude) {
			if (isRoutingRuleMatch(pathname, exclude)) {
				return env.ASSETS.fetch(request);
			}
		}
		for (const include of routes.include) {
			if (isRoutingRuleMatch(pathname, include)) {
				if (worker.fetch === void 0) {
					throw new TypeError("Entry point missing `fetch` handler");
				}
				return worker.fetch(request, env, context);
			}
		}
		return env.ASSETS.fetch(request);
	},
};
export { pages_dev_pipeline_default as default };
//# sourceMappingURL=z5i9ecp5od.js.map
