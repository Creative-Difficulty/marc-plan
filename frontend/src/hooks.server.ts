import PocketBase from 'pocketbase';
import { redirect, type Handle } from '@sveltejs/kit';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { dev } from '$app/environment';

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.user = null;
    event.locals.pb = new PocketBase(PUBLIC_POCKETBASE_URL);
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || "");

    try {
        // get an up-to-date auth store state by veryfing and refreshing the loaded auth model (if any)
        event.locals.pb.authStore.isValid && await event.locals.pb.collection('users').authRefresh();
    } catch (_) {
        // clear the auth store on failed refresh
        event.locals.pb.authStore.clear();
    }
    
    const response = await resolve(event);
    if(event.url.pathname === "/login" && event.locals.pb.authStore.isValid === false) { return response; }
    
    if(event.locals.pb.authStore.isValid === true) {
        event.locals.user = event.locals.pb.authStore.model;
        response.headers.set("set-cookie", event.locals.pb.authStore.exportToCookie({ secure: !dev }, "pb_auth"));
        return response;
    }
    
    throw redirect(302, "/login");
}