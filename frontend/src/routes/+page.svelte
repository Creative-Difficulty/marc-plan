<script lang="ts">
	import { Pencil, Plus, Trash2 } from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
    import { DatePicker } from 'date-picker-svelte';
	import toast from 'svelte-french-toast';
    import { pb } from "$lib/pocketbase"
	import { goto, invalidateAll } from '$app/navigation';
    import * as Card from "$lib/components/ui/card";
	import { browser } from '$app/environment';

    export let data;

    $: if(data.toast !== "" && browser) {
        toast.error(data.toast);
        goto("/login", { invalidateAll: true });
    }
    
	let addDialogOpen = false;
    let selectedDate = new Date();
    let clientName = "";
	async function handleNewAppointment() {
		addDialogOpen = true;
        if(clientName === "") { toast.error("Name der Schülerin/des Schülers darf nicht leer sein"); return; }
        // if(session == null) { toast.error("Sie sind nicht eingeloggt!"); await invalidateAll(); return; }
        const data = {
            "created_by": "test",
            "date_time": "2022-01-01 10:00:00.123Z",
            "client_name": "test",
            "public": true
        };

        let newAppointment;
        try {
            newAppointment = await pb.collection('appointments').create(data);
            await invalidateAll();
        } catch(error) {
            toast.error(`Ein Fehler ist aufgetreten: ${error}`);
        }
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

{#if data.appointments === null}
     <div>
        <p>Ein Fehler ist aufgetreten: {data.toast}</p>
     </div>
{:else if data.appointments.length === 0}
    <div>
        <p>Keine Termine geplant!</p>
    </div>
{:else}
    {#each data.appointments as appointment}
        <Card.Root class="w-[350px]">
            <Card.Header>
                <Card.Title>{appointment.client_name}</Card.Title>
                <Card.Description>erstellt von {appointment.created_by_email}</Card.Description>
            </Card.Header>
            <Card.Content>
                <p></p>
            </Card.Content>
            <Card.Footer class="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Deploy</Button>
            </Card.Footer>
        </Card.Root>
    {/each}
{/if}
