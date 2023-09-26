import type { PageServerLoad } from './$types';

import { _sessions } from '../+page.server';
import { error, type Actions, fail } from '@sveltejs/kit';

export const load = (async ({params}) => {
    let session = params.session;
    
    if(!_sessions.has(session)){
        throw error(418, "Session not found")
    }

    let messages = _sessions.get(session)!;
    return {session, messages};
}) satisfies PageServerLoad;

export const actions: Actions = {
    message: async ({ request, params, cookies }) => {
        let session = params.session;
        if (!session || !_sessions.has(session)) {
            throw error(418, "session not found");
        }
        let data = await request.formData();
        let message = data.get("message")?.toString();
        if (!message) {
            return fail(400, { message: "not found" });
        }
        let messages = _sessions.get(session)!;
        let username = cookies.get("username")
        if (!username){
            username = "Guest"
        }
        messages.push(username+ ": " +message);
    },
};