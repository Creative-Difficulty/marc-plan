import { dev } from '$app/environment';
import type { Actions } from './$types';

export const actions: Actions = {
	register: async ({ locals, request }) => {
		const formData = await request.formData();
		const email = formData.get('user_email') as string;
		const password = formData.get('user_password') as string;

        try {
            await locals.pb.collection("users").create({
                email: email,
                password: password,
                passwordConfirm: password
            })
            
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch(error: any) {
            console.log(error);
            return {
                action: "register",
                message: null,
                error: `Fehler beim registrieren: ${error.response.message}`
            };
        }
        
		return {
            action: "register",
			message: "Erfolgreich registriert! Bitte melden sie sich mit ihren gewählten Anmeldedaten an.",
            error: null
		};
	},
	login: async ({ request, locals }) => {
		const formData = await request.formData();
		const email = formData.get('user_email') as string;
		const password = formData.get('user_password') as string;
        
        try {
            await locals.pb.collection("users").authWithPassword(email, password);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch(error: any) {
            return {
                action: "login",
                error:  `Fehler beim einloggen: ${error.response.message !== undefined ? error.response.message : error}`,
                message: null
            };
        }
        
        if(locals.pb.authStore.isValid === true) { request.headers.set("set-cookie", locals.pb.authStore.exportToCookie({ secure: !dev }, "pb_auth")); }

		return {
			action: "login",
            message: locals.pb.authStore.isValid ? "Erfolgreich eingeloggt." : null,
			error: locals.pb.authStore.isValid ? null : "Fehler beim einloggen."
		};
	}
}
