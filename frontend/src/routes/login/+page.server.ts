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
            return {
                action: "register",
                message: null,
                error: `Fehler beim registrieren: ${error.toString()}`
            };
        }
        
		return {
            action: "register",
			message: "Erfolgreich registriert!",
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
                error:  `Fehler beim einloggen: ${error.toString()}`,
                message: null
            };
        }

        if(locals.pb.authStore.isValid === true) {
            return {
                action: "login",
                message: locals.pb.authStore.isValid ? "Erfolgreich eingeloggt." : null,
                error: locals.pb.authStore.isValid ? null : "Fehler beim einloggen."
            };
        }
	}
}
