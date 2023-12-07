<script lang="ts">
	import { LogOut } from 'lucide-svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import toast from 'svelte-french-toast';
	import { goto } from '$app/navigation';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import type { Database } from '$lib/supabase-types';
	import { browser } from '$app/environment';

	export let supabase: SupabaseClient<
		Database,
		'public',
		{
			Tables: {};
			Views: {};
			Functions: {};
			Enums: {};
			CompositeTypes: {};
		}
	>;

	async function handleSignOut() {
		const session = await supabase.auth.getSession();
		if (session.data.session !== null) {
			const logOutResponse = await supabase.auth.signOut();

			if (logOutResponse.error === null) {
				toast.success('Erfolgreich ausgeloggt.');
				if (browser) {
					goto('/login', { invalidateAll: true });
				}
			} else {
				toast.error(`Fehler während des ausloggens: ${logOutResponse.error.message}`);
			}
		} else {
			toast.error('Nicht eingeloggt.');
		}
	}
</script>

<nav class="sticky top-0 z-10 bg-white backdrop-filter backdrop-blur-2xl bg-opacity-30">
	<div class="justify-center max-w-7xl px-3 mx-2">
		<div class="flex items-center justify-between h-16">
			<p class="max-xsm:text-[13px] leading-4 max-sm:text-[17px] text-2xl text-gray-900 font-semibold">Marc's Klavier-Planer</p>
			<div class="flex space-x-5 text-gray-900">
				<Button href="/" data-sveltekit-reload class="sm:{buttonVariants({ size: 'sm' })}">Dashboard</Button>
				<Button
					class="sm:{buttonVariants({
						size: 'sm'
					})} grid grid-rows-1 grid-flow-col gap-1 content-center"
					on:click={async () => await handleSignOut()}
				>
					<LogOut />
					<p>Ausloggen</p>
				</Button>
			</div>
		</div>
	</div>
</nav>
