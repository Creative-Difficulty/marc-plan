<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { LogIn } from 'lucide-svelte';
	import { Loader2 } from 'lucide-svelte';
	import toast from 'svelte-french-toast';
	import { goto } from '$app/navigation';
	import './login.postcss';
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { browser } from '$app/environment';

	export let form: ActionData;

	let showLoadingButton = false;

	let progressiveWrongEmail = false;
	let passwordTooShort = false;
	$: formHasError = form?.error !== undefined && form?.error !== null;

	$: if (form?.error === null) {
		toast.success(`Erfolgreich ${form.action}`);
        if(browser) {
            goto('/login', { invalidateAll: true });
        }
	} else if (form?.error !== null && form?.error !== undefined) {
		if (form?.error === "User already registered") formHasError = false;
		toast.error(`Fehler: ${form.error}`);
	}
</script>

<div class="flex justify-center items-center h-screen w-screen">
	<Card.Root class="shadow-2xl rounded-lg w-3/4 max-w-[400px] md:w-[400px]">
		<Card.Header>
			<Card.Title>Login</Card.Title>
			<Card.Description>Melden sie sich an oder registrieren sie sich.</Card.Description>
		</Card.Header>
		<form
			method="POST"
			on:submit={() => (showLoadingButton = true)}
			use:enhance={({ formData, cancel }) => {
				showLoadingButton = true;
				// `formElement` is this `<form>` element        // `formData` is its `FormData` object that's about to be submitted        // `action` is the URL to which the form is posted        // calling `cancel()` will prevent the submission        // `submitter` is the `HTMLElement` that caused the form to be submitted
				const formDataObjects = Object.fromEntries(formData);

				const isEmail = new RegExp(
					/^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/
				).test(String(formDataObjects.user_email).toLowerCase());
				if (!isEmail) {
					progressiveWrongEmail = true;
					showLoadingButton = false;
					cancel();
				} else {
					progressiveWrongEmail = false;
				}

				if (String(formDataObjects.user_password).length < 6) {
					passwordTooShort = true;
					showLoadingButton = false;
					cancel();
				} else {
					passwordTooShort = false;
				}

				return async ({ update }) => {
					// `result` is an `ActionResult` object            // `update` is a function which triggers the default logic that would be triggered if this callback wasn't set        };
					await update({ reset: false });
					showLoadingButton = false;
				};
			}}
		>
			<Card.Content class="space-y-2">
				<div class="space-y-1">
					<Label for="user_email">E-Mail</Label>
					<Input
						type="text"
						id="user_email"
						name="user_email"
						class={progressiveWrongEmail || formHasError ? 'border-2 border-rose-600' : ''}
					/>
					{#if progressiveWrongEmail}
						<p class="text-sm text-muted-foreground text-red-600">E-Mail ist nicht gültig</p>
					{:else if formHasError}
						<p class="text-sm text-muted-foreground text-red-600">
							E-Mail und/oder Passwort sind falsch
						</p>
					{/if}
				</div>
				<div class="space-y-1">
					<Label for="user_password">Password</Label>
					<Input
						id="user_password"
						name="user_password"
						type="password"
						class={formHasError || passwordTooShort ? 'border-2 border-rose-600' : ''}
					/>
					{#if passwordTooShort}
						<p class="text-sm text-muted-foreground text-red-600">Passwort ist zu kurz</p>
					{:else if formHasError}
						<p class="text-sm text-muted-foreground text-red-600">
							Passwort und/oder E-Mail sind falsch
						</p>
					{/if}
				</div>
			</Card.Content>
			<Card.Footer>
				<div class="flex items-center space-x-5">
					{#if showLoadingButton}
						<Button disabled class="sm:{buttonVariants({ size: 'sm' })}">
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							Bitte warten...
						</Button>
					{:else}
						<Button type="submit" formaction="?/login" class="sm:{buttonVariants({ size: 'sm' })}">
							<LogIn class="mr-2 h-4 w-4" />
							Anmelden
						</Button>
					{/if}
					{#if showLoadingButton}
						<Button disabled class="sm:{buttonVariants({ size: 'sm' })}">
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							Bitte warten...
						</Button>
					{:else}
						<!-- class="w-30 h-10" -->
						<Button
							type="submit"
							formaction="?/register"
							class="sm:{buttonVariants({ size: 'sm' })}"
						>
							Registrieren
						</Button>
					{/if}
				</div>
			</Card.Footer>
		</form>
	</Card.Root>
</div>
