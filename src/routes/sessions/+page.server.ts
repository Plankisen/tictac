import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export const load = (async () => {
    const sessionList: string[] = [];
    const sessions = await prisma.session.findMany({});
    sessions.forEach((session) => {
        sessionList.push(session.sessionName);
    });
    return {_sessions: sessionList}
}) satisfies PageServerLoad;

export const actions: Actions = {
    create: async ({ request, cookies }) => {
        let data = await request.formData();
        let sessionName = data.get("sessionName")?.toString();
        if (!sessionName) {
            return fail(400, { sessionName: "Please supply a name" });
        }

        let username = cookies.get("username") || "Guest";
        const prismaUser = await prisma.user.findUnique({ where: { name: username } });
        const userId = prismaUser?.id;

        try {
            // Skapa en ny session med Prisma och spara sessionName
            const createdSession = await prisma.session.create({
                data: {
                    sessionName,
                    creator: {
                        connect: {
                            id: userId
                        }
                    },
                    messages: { create: [] }, // Skapa en tom lista med meddelanden för den nya sessionen
                },
            });
            
        console.log(sessionName);
        } catch (error) {
            console.error("Error creating session:", error);
            return fail(500, { sessionName: "Failed to create session" });
        }
    },
};