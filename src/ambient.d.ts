declare module "*.ttf" {
	const value: ArrayBuffer;
	export default value;
}

// this file is generated — do not edit it

/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 *
 * _Unlike_ [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 *
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 *
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 *
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 *
 * You can override `.env` values from the command line like so:
 *
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module "$env/static/private" {
	export const MONGODB_URL: string;
	export const MONGODB_DB_NAME: string;
	export const MONGODB_DIRECT_CONNECTION: string;
	export const COOKIE_NAME: string;
	export const TRUSTED_EMAIL_HEADER: string;
	export const HF_TOKEN: string;
	export const HF_API_ROOT: string;
	export const OPENAI_API_KEY: string;
	export const ANTHROPIC_API_KEY: string;
	export const CLOUDFLARE_ACCOUNT_ID: string;
	export const CLOUDFLARE_API_TOKEN: string;
	export const COHERE_API_TOKEN: string;
	export const HF_ACCESS_TOKEN: string;
	export const YDC_API_KEY: string;
	export const SERPER_API_KEY: string;
	export const SERPAPI_KEY: string;
	export const SERPSTACK_API_KEY: string;
	export const SEARCHAPI_KEY: string;
	export const USE_LOCAL_WEBSEARCH: string;
	export const SEARXNG_QUERY_URL: string;
	export const PLAYWRIGHT_ADBLOCKER: string;
	export const WEBSEARCH_ALLOWLIST: string;
	export const WEBSEARCH_BLOCKLIST: string;
	export const WEBSEARCH_JAVASCRIPT: string;
	export const OPENID_CONFIG: string;
	export const OPENID_CLIENT_ID: string;
	export const OPENID_CLIENT_SECRET: string;
	export const OPENID_SCOPES: string;
	export const OPENID_NAME_CLAIM: string;
	export const OPENID_PROVIDER_URL: string;
	export const OPENID_TOLERANCE: string;
	export const OPENID_RESOURCE: string;
	export const USE_CLIENT_CERTIFICATE: string;
	export const CERT_PATH: string;
	export const KEY_PATH: string;
	export const CA_PATH: string;
	export const CLIENT_KEY_PASSWORD: string;
	export const REJECT_UNAUTHORIZED: string;
	export const TEXT_EMBEDDING_MODELS: string;
	export const MODELS: string;
	export const OLD_MODELS: string;
	export const TASK_MODEL: string;
	export const PARQUET_EXPORT_DATASET: string;
	export const PARQUET_EXPORT_HF_TOKEN: string;
	export const ADMIN_API_SECRET: string;
	export const PARQUET_EXPORT_SECRET: string;
	export const RATE_LIMIT: string;
	export const MESSAGES_BEFORE_LOGIN: string;
	export const APP_BASE: string;
	export const LLM_SUMMARIZATION: string;
	export const EXPOSE_API: string;
	export const ENABLE_ASSISTANTS: string;
	export const ENABLE_ASSISTANTS_RAG: string;
	export const REQUIRE_FEATURED_ASSISTANTS: string;
	export const ENABLE_LOCAL_FETCH: string;
	export const ALTERNATIVE_REDIRECT_URLS: string;
	export const WEBHOOK_URL_REPORT_ASSISTANT: string;
	export const ALLOWED_USER_EMAILS: string;
	export const USAGE_LIMITS: string;
	export const ALLOW_INSECURE_COOKIES: string;
	export const METRICS_ENABLED: string;
	export const METRICS_PORT: string;
	export const LOG_LEVEL: string;
	export const BODY_SIZE_LIMIT: string;
	export const GJS_DEBUG_TOPICS: string;
	export const LESSOPEN: string;
	export const USER: string;
	export const LC_TIME: string;
	export const npm_config_user_agent: string;
	export const GIO_MODULE_DIR: string;
	export const XDG_SESSION_TYPE: string;
	export const GIT_ASKPASS: string;
	export const GTK_EXE_PREFIX_VSCODE_SNAP_ORIG: string;
	export const npm_config_fetch_retries: string;
	export const npm_node_execpath: string;
	export const GDK_BACKEND_VSCODE_SNAP_ORIG: string;
	export const SHLVL: string;
	export const npm_config_noproxy: string;
	export const HOME: string;
	export const CHROME_DESKTOP: string;
	export const LOCPATH_VSCODE_SNAP_ORIG: string;
	export const OLDPWD: string;
	export const TERM_PROGRAM_VERSION: string;
	export const DESKTOP_SESSION: string;
	export const GTK_PATH: string;
	export const NVM_BIN: string;
	export const npm_package_json: string;
	export const PYENV_SHELL: string;
	export const NVM_INC: string;
	export const GTK_IM_MODULE_FILE: string;
	export const GIO_LAUNCHED_DESKTOP_FILE: string;
	export const GNOME_SHELL_SESSION_MODE: string;
	export const GTK_MODULES: string;
	export const GSETTINGS_SCHEMA_DIR_VSCODE_SNAP_ORIG: string;
	export const VSCODE_GIT_ASKPASS_MAIN: string;
	export const PS1: string;
	export const LC_MONETARY: string;
	export const VSCODE_GIT_ASKPASS_NODE: string;
	export const MANAGERPID: string;
	export const npm_config_userconfig: string;
	export const npm_config_local_prefix: string;
	export const SYSTEMD_EXEC_PID: string;
	export const IM_CONFIG_CHECK_ENV: string;
	export const DBUS_SESSION_BUS_ADDRESS: string;
	export const npm_config_engine_strict: string;
	export const COLORTERM: string;
	export const GIO_LAUNCHED_DESKTOP_FILE_PID: string;
	export const COLOR: string;
	export const NVM_DIR: string;
	export const IM_CONFIG_PHASE: string;
	export const WAYLAND_DISPLAY: string;
	export const LOGNAME: string;
	export const JOURNAL_STREAM: string;
	export const _: string;
	export const npm_config_prefix: string;
	export const npm_config_npm_version: string;
	export const XDG_CONFIG_DIRS_VSCODE_SNAP_ORIG: string;
	export const XDG_SESSION_CLASS: string;
	export const XDG_DATA_DIRS_VSCODE_SNAP_ORIG: string;
	export const USERNAME: string;
	export const TERM: string;
	export const npm_config_cache: string;
	export const GNOME_DESKTOP_SESSION_ID: string;
	export const npm_config_node_gyp: string;
	export const PATH: string;
	export const SESSION_MANAGER: string;
	export const GTK_EXE_PREFIX: string;
	export const INVOCATION_ID: string;
	export const PAPERSIZE: string;
	export const NODE: string;
	export const npm_package_name: string;
	export const XDG_MENU_PREFIX: string;
	export const LC_ADDRESS: string;
	export const BAMF_DESKTOP_FILE_HINT: string;
	export const GNOME_SETUP_DISPLAY: string;
	export const XDG_RUNTIME_DIR: string;
	export const GDK_BACKEND: string;
	export const DISPLAY: string;
	export const LOCPATH: string;
	export const LANG: string;
	export const XDG_CURRENT_DESKTOP: string;
	export const LC_TELEPHONE: string;
	export const VIRTUAL_ENV_PROMPT: string;
	export const GIO_MODULE_DIR_VSCODE_SNAP_ORIG: string;
	export const XMODIFIERS: string;
	export const XDG_SESSION_DESKTOP: string;
	export const XAUTHORITY: string;
	export const LS_COLORS: string;
	export const VSCODE_GIT_IPC_HANDLE: string;
	export const TERM_PROGRAM: string;
	export const npm_lifecycle_script: string;
	export const SSH_AGENT_LAUNCHER: string;
	export const SSH_AUTH_SOCK: string;
	export const GSETTINGS_SCHEMA_DIR: string;
	export const ORIGINAL_XDG_CURRENT_DESKTOP: string;
	export const SHELL: string;
	export const LC_NAME: string;
	export const npm_package_version: string;
	export const npm_lifecycle_event: string;
	export const QT_ACCESSIBILITY: string;
	export const GDMSESSION: string;
	export const GEM_HOME: string;
	export const LESSCLOSE: string;
	export const GTK_PATH_VSCODE_SNAP_ORIG: string;
	export const GTK_IM_MODULE_FILE_VSCODE_SNAP_ORIG: string;
	export const LC_MEASUREMENT: string;
	export const GJS_DEBUG_OUTPUT: string;
	export const LC_IDENTIFICATION: string;
	export const VIRTUAL_ENV: string;
	export const VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
	export const QT_IM_MODULE: string;
	export const npm_config_globalconfig: string;
	export const npm_config_init_module: string;
	export const PWD: string;
	export const npm_execpath: string;
	export const XDG_CONFIG_DIRS: string;
	export const NVM_CD_FLAGS: string;
	export const PYENV_ROOT: string;
	export const XDG_DATA_DIRS: string;
	export const npm_config_global_prefix: string;
	export const LC_NUMERIC: string;
	export const npm_command: string;
	export const LC_PAPER: string;
	export const INIT_CWD: string;
	export const EDITOR: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://kit.svelte.dev/docs/modules#$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 *
 * Values are replaced statically at build time.
 *
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module "$env/static/public" {
	export const PUBLIC_ORIGIN: string;
	export const PUBLIC_SHARE_PREFIX: string;
	export const PUBLIC_GOOGLE_ANALYTICS_ID: string;
	export const PUBLIC_PLAUSIBLE_SCRIPT_URL: string;
	export const PUBLIC_ANNOUNCEMENT_BANNERS: string;
	export const PUBLIC_APPLE_APP_ID: string;
	export const PUBLIC_APP_NAME: string;
	export const PUBLIC_APP_ASSETS: string;
	export const PUBLIC_APP_COLOR: string;
	export const PUBLIC_APP_DESCRIPTION: string;
	export const PUBLIC_APP_DATA_SHARING: string;
	export const PUBLIC_APP_DISCLAIMER: string;
	export const PUBLIC_APP_DISCLAIMER_MESSAGE: string;
	export const PUBLIC_VERSION: string;
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/master/packages/adapter-node) (or running [`vite preview`](https://kit.svelte.dev/docs/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 *
 * This module cannot be imported into client-side code.
 *
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 *
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module "$env/dynamic/private" {
	export const env: {
		MONGODB_URL: string;
		MONGODB_DB_NAME: string;
		MONGODB_DIRECT_CONNECTION: string;
		COOKIE_NAME: string;
		TRUSTED_EMAIL_HEADER: string;
		HF_TOKEN: string;
		HF_API_ROOT: string;
		OPENAI_API_KEY: string;
		ANTHROPIC_API_KEY: string;
		CLOUDFLARE_ACCOUNT_ID: string;
		CLOUDFLARE_API_TOKEN: string;
		COHERE_API_TOKEN: string;
		HF_ACCESS_TOKEN: string;
		YDC_API_KEY: string;
		SERPER_API_KEY: string;
		SERPAPI_KEY: string;
		SERPSTACK_API_KEY: string;
		SEARCHAPI_KEY: string;
		USE_LOCAL_WEBSEARCH: string;
		SEARXNG_QUERY_URL: string;
		PLAYWRIGHT_ADBLOCKER: string;
		WEBSEARCH_ALLOWLIST: string;
		WEBSEARCH_BLOCKLIST: string;
		WEBSEARCH_JAVASCRIPT: string;
		OPENID_CONFIG: string;
		OPENID_CLIENT_ID: string;
		OPENID_CLIENT_SECRET: string;
		OPENID_SCOPES: string;
		OPENID_NAME_CLAIM: string;
		OPENID_PROVIDER_URL: string;
		OPENID_TOLERANCE: string;
		OPENID_RESOURCE: string;
		USE_CLIENT_CERTIFICATE: string;
		CERT_PATH: string;
		KEY_PATH: string;
		CA_PATH: string;
		CLIENT_KEY_PASSWORD: string;
		REJECT_UNAUTHORIZED: string;
		TEXT_EMBEDDING_MODELS: string;
		MODELS: string;
		OLD_MODELS: string;
		TASK_MODEL: string;
		PARQUET_EXPORT_DATASET: string;
		PARQUET_EXPORT_HF_TOKEN: string;
		ADMIN_API_SECRET: string;
		PARQUET_EXPORT_SECRET: string;
		RATE_LIMIT: string;
		MESSAGES_BEFORE_LOGIN: string;
		APP_BASE: string;
		LLM_SUMMARIZATION: string;
		EXPOSE_API: string;
		ENABLE_ASSISTANTS: string;
		ENABLE_ASSISTANTS_RAG: string;
		REQUIRE_FEATURED_ASSISTANTS: string;
		ENABLE_LOCAL_FETCH: string;
		ALTERNATIVE_REDIRECT_URLS: string;
		WEBHOOK_URL_REPORT_ASSISTANT: string;
		ALLOWED_USER_EMAILS: string;
		USAGE_LIMITS: string;
		ALLOW_INSECURE_COOKIES: string;
		METRICS_ENABLED: string;
		METRICS_PORT: string;
		LOG_LEVEL: string;
		BODY_SIZE_LIMIT: string;
		GJS_DEBUG_TOPICS: string;
		LESSOPEN: string;
		USER: string;
		LC_TIME: string;
		npm_config_user_agent: string;
		GIO_MODULE_DIR: string;
		XDG_SESSION_TYPE: string;
		GIT_ASKPASS: string;
		GTK_EXE_PREFIX_VSCODE_SNAP_ORIG: string;
		npm_config_fetch_retries: string;
		npm_node_execpath: string;
		GDK_BACKEND_VSCODE_SNAP_ORIG: string;
		SHLVL: string;
		npm_config_noproxy: string;
		HOME: string;
		CHROME_DESKTOP: string;
		LOCPATH_VSCODE_SNAP_ORIG: string;
		OLDPWD: string;
		TERM_PROGRAM_VERSION: string;
		DESKTOP_SESSION: string;
		GTK_PATH: string;
		NVM_BIN: string;
		npm_package_json: string;
		PYENV_SHELL: string;
		NVM_INC: string;
		GTK_IM_MODULE_FILE: string;
		GIO_LAUNCHED_DESKTOP_FILE: string;
		GNOME_SHELL_SESSION_MODE: string;
		GTK_MODULES: string;
		GSETTINGS_SCHEMA_DIR_VSCODE_SNAP_ORIG: string;
		VSCODE_GIT_ASKPASS_MAIN: string;
		PS1: string;
		LC_MONETARY: string;
		VSCODE_GIT_ASKPASS_NODE: string;
		MANAGERPID: string;
		npm_config_userconfig: string;
		npm_config_local_prefix: string;
		SYSTEMD_EXEC_PID: string;
		IM_CONFIG_CHECK_ENV: string;
		DBUS_SESSION_BUS_ADDRESS: string;
		npm_config_engine_strict: string;
		COLORTERM: string;
		GIO_LAUNCHED_DESKTOP_FILE_PID: string;
		COLOR: string;
		NVM_DIR: string;
		IM_CONFIG_PHASE: string;
		WAYLAND_DISPLAY: string;
		LOGNAME: string;
		JOURNAL_STREAM: string;
		_: string;
		npm_config_prefix: string;
		npm_config_npm_version: string;
		XDG_CONFIG_DIRS_VSCODE_SNAP_ORIG: string;
		XDG_SESSION_CLASS: string;
		XDG_DATA_DIRS_VSCODE_SNAP_ORIG: string;
		USERNAME: string;
		TERM: string;
		npm_config_cache: string;
		GNOME_DESKTOP_SESSION_ID: string;
		npm_config_node_gyp: string;
		PATH: string;
		SESSION_MANAGER: string;
		GTK_EXE_PREFIX: string;
		INVOCATION_ID: string;
		PAPERSIZE: string;
		NODE: string;
		npm_package_name: string;
		XDG_MENU_PREFIX: string;
		LC_ADDRESS: string;
		BAMF_DESKTOP_FILE_HINT: string;
		GNOME_SETUP_DISPLAY: string;
		XDG_RUNTIME_DIR: string;
		GDK_BACKEND: string;
		DISPLAY: string;
		LOCPATH: string;
		LANG: string;
		XDG_CURRENT_DESKTOP: string;
		LC_TELEPHONE: string;
		VIRTUAL_ENV_PROMPT: string;
		GIO_MODULE_DIR_VSCODE_SNAP_ORIG: string;
		XMODIFIERS: string;
		XDG_SESSION_DESKTOP: string;
		XAUTHORITY: string;
		LS_COLORS: string;
		VSCODE_GIT_IPC_HANDLE: string;
		TERM_PROGRAM: string;
		npm_lifecycle_script: string;
		SSH_AGENT_LAUNCHER: string;
		SSH_AUTH_SOCK: string;
		GSETTINGS_SCHEMA_DIR: string;
		ORIGINAL_XDG_CURRENT_DESKTOP: string;
		SHELL: string;
		LC_NAME: string;
		npm_package_version: string;
		npm_lifecycle_event: string;
		QT_ACCESSIBILITY: string;
		GDMSESSION: string;
		GEM_HOME: string;
		LESSCLOSE: string;
		GTK_PATH_VSCODE_SNAP_ORIG: string;
		GTK_IM_MODULE_FILE_VSCODE_SNAP_ORIG: string;
		LC_MEASUREMENT: string;
		GJS_DEBUG_OUTPUT: string;
		LC_IDENTIFICATION: string;
		VIRTUAL_ENV: string;
		VSCODE_GIT_ASKPASS_EXTRA_ARGS: string;
		QT_IM_MODULE: string;
		npm_config_globalconfig: string;
		npm_config_init_module: string;
		PWD: string;
		npm_execpath: string;
		XDG_CONFIG_DIRS: string;
		NVM_CD_FLAGS: string;
		PYENV_ROOT: string;
		XDG_DATA_DIRS: string;
		npm_config_global_prefix: string;
		LC_NUMERIC: string;
		npm_command: string;
		LC_PAPER: string;
		INIT_CWD: string;
		EDITOR: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	};
}

/**
 * Similar to [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 *
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 *
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module "$env/dynamic/public" {
	export const env: {
		PUBLIC_ORIGIN: string;
		PUBLIC_SHARE_PREFIX: string;
		PUBLIC_GOOGLE_ANALYTICS_ID: string;
		PUBLIC_PLAUSIBLE_SCRIPT_URL: string;
		PUBLIC_ANNOUNCEMENT_BANNERS: string;
		PUBLIC_APPLE_APP_ID: string;
		PUBLIC_APP_NAME: string;
		PUBLIC_APP_ASSETS: string;
		PUBLIC_APP_COLOR: string;
		PUBLIC_APP_DESCRIPTION: string;
		PUBLIC_APP_DATA_SHARING: string;
		PUBLIC_APP_DISCLAIMER: string;
		PUBLIC_APP_DISCLAIMER_MESSAGE: string;
		PUBLIC_VERSION: string;
		[key: `PUBLIC_${string}`]: string | undefined;
	};
}
