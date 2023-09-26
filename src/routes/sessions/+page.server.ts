import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export let _sessions: Map<string, string[]> = new Map();

export const load = (async () => {
    return {_sessions};
}) satisfies PageServerLoad;

export const actions: Actions = {
    create: async ({request})=>{
        let data = await request.formData()
        let sessionName = data.get("sessionName")?.toString()
        if(!sessionName){
            return fail(400,{sessionName:"Please supply a name"})
        }
        console.log(sessionName)
        _sessions.set(sessionName, [])
    }
};