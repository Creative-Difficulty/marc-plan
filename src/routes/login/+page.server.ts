import type { Actions } from "./$types";
export const actions = {
    register: async ({ request, url, locals: { supabase } }) => {
        const formData = await request.formData();
        const email = formData.get("user_email") as string
        const password = formData.get("user_password") as string
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${url.origin}/auth/callback`,
            },
        });
        return {
            action: "registriert",
            error: error?.message === undefined ? null : error?.message
        }
    },
    login: async ({ request, url, locals: { supabase } }) => {
        const formData = await request.formData();
        const email = formData.get("user_email") as string
        const password = formData.get("user_password") as string
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return {
            action: "eingeloggt",
            error: error?.message === undefined ? null : error?.message
        }
    }
} satisfies Actions;