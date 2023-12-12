<script lang="ts">
    import { LogOut } from 'lucide-svelte';
    import { Button, buttonVariants } from "$lib/components/ui/button";
    import toast from 'svelte-french-toast';
    import { goto, invalidateAll } from '$app/navigation';
    import { page } from '$app/stores';
    import type { AuthError, Session, SupabaseClient } from '@supabase/supabase-js';
    import type { Database } from '$lib/supabase-types';
    export const ssr = false;
    export let supabase: SupabaseClient<Database, "public", {
        Tables: {};
        Views: {};
        Functions: {};
        Enums: {};
        CompositeTypes: {};
    }>
    let session: { data: { session: Session; }; error: null; } | { data: { session: null; }; error: AuthError; } | { data: { session: null; }; error: null; };
    async function handleSignOut() {
        session = await supabase.auth.getSession();
        console.log(session);
        if(session.data.session !== null) {
            const logOutResponse = await supabase.auth.signOut();
            
            if(logOutResponse.error === null) {
                toast.success("Erfolgreich ausgeloggt.");
                goto("/login");
            } else {
                toast.error(`Fehler während des ausloggens: ${logOutResponse.error.message}`);
            }
        } else {
            toast.error("Nicht eingeloggt.")
        }
    }
</script>

<nav class="sticky top-0 z-10 bg-white backdrop-filter backdrop-blur-lg bg-opacity-30">
    <div class="max-w-5xl mx-auto px-3 md:px-0">
        <div class="flex items-center justify-between h-16">
            <p class="text-[13px] md:text-2xl text-gray-900 font-semibold">Marc's Klavier-Planer</p>
            <div class="flex space-x-5 text-gray-900">
                <Button href="/" data-sveltekit-reload class="sm:{buttonVariants({ size: "sm" })}">
                    Dashboard
                </Button>
                <Button class="sm:{buttonVariants({ size: "sm" })} grid grid-rows-1 grid-flow-col gap-1 content-center" on:click={async () => await handleSignOut()}>
                    <LogOut />
                    <p>Ausloggen</p>
                </Button>
            </div>
        </div>
    </div>
</nav>