import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { prisma } from "$lib";

// om vi försöker besöka home (/) oinloggad, navigera till login
export const load = (async ({ cookies }) => {
  let token_id = cookies.get("token_id");
  if (!token_id) {
    throw redirect(303, "/login");
  }

  let result = await prisma.token.findUnique({
    where: { id: token_id },
    include: { user: { select: { name: true, id: true } } },
  });

  if (!result) {
    cookies.delete("token_id");
    throw redirect(303, "/login");
  }

  const expiration_time_in_days = 14;

  if (
    Date.now() - result.createdAt.getTime() >
    1000 * 24 * 60 * 60 * expiration_time_in_days
  ) {
    cookies.delete("token_id");
    cookies.delete('username');
    await prisma.token.delete({ where: { id: token_id } });
    throw redirect(303, "/login");
  }

  return { user: result.user };
}) satisfies LayoutServerLoad;