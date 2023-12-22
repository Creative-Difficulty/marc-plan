import type { TypedPocketBase } from '$lib/pb-types';
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
            pb: TypedPocketBase
            user: import('pocketbase').BaseAuthStore | null
        }
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
