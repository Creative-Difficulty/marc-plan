import type { PageServerLoad } from "./$types";
import type { AppointmentsRecord, AuthSystemFields } from "$lib/pb-types";
import type { LocalAppointment } from "$lib/types";

export const load: PageServerLoad = async ({ locals, request }) => {
    //@ts-expect-error The boolean gets re-set when calling loadFromCookie
    if(locals.pb.authStore.isValid !== true) { locals.pb.authStore.loadFromCookie(request.headers.get('cookie') || ""); if(locals.pb.authStore.isValid !== true) { return { valid_session: false, user: null, appointments: null, toast: "Nicht eingeloggt!"} } }
    if(locals.pb.authStore.model === undefined || locals.pb.authStore.model === null) { locals.pb.authStore.loadFromCookie(request.headers.get('cookie') || ""); if(locals.pb.authStore.model === undefined || locals.pb.authStore.model === null) { return { valid_session: false, user: null, appointments: null, toast: "Nicht eingeloggt!"} } }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let user: AuthSystemFields | null;
    let errorToReturn = "";
    try {
        user = await locals.pb.collection("users").getOne(locals.pb.authStore.model.id as string);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch(error: any) {
        errorToReturn = error.toString();
        user = null;
    }

    if(errorToReturn !== "") {
        return {
            valid_session: locals.pb.authStore.isValid,
            user: user,
            appointments: null,
            toast: errorToReturn
        };
    }

    const appointments: Array<AppointmentsRecord> = (await locals.pb.collection("appointments").getFullList({ batch: 100 }));
    const appointmentsWithEmails: Array<LocalAppointment> = [];
    await new Promise<void>((resolve) => {
        appointments.forEach(async (appointment: AppointmentsRecord, index) => {
            const user: AuthSystemFields = await locals.pb.collection("users").getOne(appointment.created_by);
            (appointment as LocalAppointment).created_by_email = user.email
            appointmentsWithEmails.push(appointment as LocalAppointment);
            if (index === appointments.length -1) resolve();
        });
    })

    return {
        valid_session: locals.pb.authStore.isValid,
        user: user,
        appointments: appointmentsWithEmails,
        toast: ""
    };

}

