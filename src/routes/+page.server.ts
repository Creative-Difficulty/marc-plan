import { redirect } from '@sveltejs/kit';
import { supabaseDBClient } from '$lib/supabaseClient';

/** @type {import('./$types').PageServerLoad} */
export async function load({ locals: { getSession } }) {
	const session = await getSession();
	if (!session) throw redirect(303, '/login');
	const appointmentsFromDB = await supabaseDBClient.from('appointments').select('*');
    console.log(appointmentsFromDB);
	if (appointmentsFromDB.error !== null || appointmentsFromDB.statusText !== 'OK') {
		throw redirect(303, '/login');
	}

	return {
		appointments: appointmentsFromDB.data
	};
}
