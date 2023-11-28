import { redirect } from "@sveltejs/kit";

export const load = async ({ cookies }) => {
  let token_id = cookies.get("token_id");
  if (token_id) {
    throw redirect(303, "/");
  } 
};