<script>
	import { invalidateAll } from "$app/navigation";
	import { pb } from "$lib/pocketbase";
    import "../app.pcss";
    import { Toaster } from 'svelte-french-toast';

    pb.authStore.onChange(async () => {
        if(pb.authStore.isValid === false) {
            await invalidateAll();
        }
    })
</script>
<Toaster />
<slot></slot>