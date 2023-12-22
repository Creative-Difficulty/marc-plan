import PocketBase from 'pocketbase';
import { redirect, type Handle } from '@sveltejs/kit';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import type { TypedPocketBase } from '$lib/pb-types';
import { dev } from '$app/environment';

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.user = null;
    event.locals.pb = new PocketBase(PUBLIC_POCKETBASE_URL) as TypedPocketBase;
    
    // load the store data from the request cookie string
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get("cookie") || "");
    
    
    try {
        // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
        event.locals.pb.authStore.isValid && await event.locals.pb.collection('users').authRefresh();
    } catch (_) {
        // clear the auth store on failed refresh
        event.locals.pb.authStore.clear();
    }
    
    event.locals.user = event.locals.pb.authStore;

    const response = await resolve(event);
    
    // send back the default 'pb_auth' cookie to the client with the latest store state
    response.headers.set("set-cookie", event.locals.pb.authStore.exportToCookie({ secure: !dev }, "pb_auth"));

    if(event.locals.pb.authStore.isValid === true || event.url.pathname === "/login") { return response }
    throw redirect(302, "/login");
}