<script lang="ts">
	import { Pencil, Plus, Trash2 } from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
    import { DateInput, DatePicker } from 'date-picker-svelte'
	import toast from 'svelte-french-toast';
	import { supabaseDBClient } from '$lib/supabaseClient';
	import { invalidateAll } from '$app/navigation';
    
    export let data;

    let { supabase, session } = data;
	$: ({ supabase, session } = data);

	let addDialogOpen = false;
    let selectedDate = new Date();
    let clientName = "";
	async function handleNewAppointment() {
		addDialogOpen = true;
        if(clientName === "") { toast.error("Name der Schülerin/des Schülers darf nicht leer sein"); return; }
        if(session == null) { toast.error("Sie sind nicht eingeloggt!"); await invalidateAll(); return; }
        const { data, error } = await supabaseDBClient.from("appointments").insert({ appointment_time: selectedDate.toISOString(), client_name: clientName });
        if(error !== null) { toast.error(`Ein Fehler ist aufgetreten: ${error.message}`) }
        addDialogOpen = false;
	}
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger asChild let:builder class="relative top-2 l-5">
        <Button variant="outline" size="icon" builders={[builder]} class="sm:{buttonVariants({ size: 'sm', variant: "outline" })} rounded-full">
            <Pencil />
        </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
        <DropdownMenu.Item on:click={() => addDialogOpen = true}>
            <Plus class="mr-2 h-4 w-4" />
            <span>Neuer Unterrichtsstunde</span>
        </DropdownMenu.Item>
        <DropdownMenu.Item on:click={() => console.log('clicked')}>
            <Trash2 color="#dc2626" class="mr-2 h-4 w-4" />
            <span>Unterrichtsstunde Löschen</span>
        </DropdownMenu.Item>
    </DropdownMenu.Content>
</DropdownMenu.Root>


<Dialog.Root open={addDialogOpen} onOpenChange={(open) => (addDialogOpen = open !== undefined ? open : false)}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Unterrichtsstunde hinzufügen</Dialog.Title>
		</Dialog.Header>
		<div class="grid gap-4 py-4">
			<div class="grid grid-cols-4 items-center gap-4">
				<Label class="text-right">Name der Schülerin oder des Schülers</Label>
				<Input class="col-span-3" placeholder="Max Mustermann" bind:value={clientName}/>
			</div>
			<div class="grid grid-cols-4 items-center gap-4">
				<Label class="text-right">Datum und Uhrzeit</Label>
				<DatePicker bind:value={selectedDate} locale={{weekdays: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"], months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]}} min={new Date()} max={new Date(new Date().setFullYear(new Date().getFullYear() + 10))}/>
			</div>
		</div>
		<Dialog.Footer>
			<Button on:click={async () => await handleNewAppointment()}>Hinzufügen</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

