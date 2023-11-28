import type { PageServerLoad } from './$types';
import { error, type Actions, fail } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const load: PageServerLoad = async ({ params }) => {
    let session = params.session;
    
    // Använd Prisma för att hämta sessionen och dess meddelanden
    const sessionData = await prisma.session.findUnique({
        where: {
            sessionName: (session),
        },
        include: {
            messages: true,
        },
    });

    if (!sessionData) {
        throw error(418, "Session not found");
    }

    let messages = sessionData.messages.map((message) => message.message);
    return { session, messages };
};

export const actions: Actions = {
    message: async ({ request, params, cookies }) => {
        let session = params.session;
        if (!session) {
            throw error(418, "session not found");
        }
        let data = await request.formData();
        let message = data.get("message")?.toString();
        if (!message) {
            return fail(400, { message: "not found" });
        }

        let username = cookies.get("username") || "Guest";

        const prismaUser = await prisma.user.findUnique({where: {name: username}})
        const userId = prismaUser?.id;

        // Använd Prisma för att skapa ett nytt meddelande och koppla det till sessionen och användaren
        await prisma.message.create({
            data: {
                message,
                sender: {
                    connect: {
                        id: userId // Byt ut detta med rätt användar-ID baserat på inloggad användare
                    },
                },
                session: {
                    connect: {
                        sessionName: (session),
                    },
                },
            },
        });
    },
};