import type { AppointmentsRecord } from "$lib/pb-types";

export type LocalAppointment = AppointmentsRecord & { created_by_email: string | undefined }
