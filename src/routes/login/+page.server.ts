import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

prisma.$connect()
  .then(() => {
    console.log('Prisma client connected to the database.');
  })
  .catch((error) => {
    console.error('Prisma client failed to connect to the database:', error);
  });


export const load: PageServerLoad = async ({ cookies }) => {
  const username = cookies.get('username');
  const password = cookies.get('password')
  if (username) {
    throw redirect(303, '/');
  }
  return {};
};

export const actions: Actions = {
  login: async ({ request, cookies }) => {
    const data = await request.formData();
    const username = data.get('username')?.toString();
    const password = data.get('password')?.toString()

    if (username && password) {
      const existingUser = await prisma.user.findUnique({ where: { name: username } });

      if (existingUser) {
        //return fail(400, { username: 'User already logged in' });
        if (password == existingUser.password){
          cookies.set('username', username)
          throw redirect(307, '/');
        }
      }
      else {
        await prisma.user.create({ data: { name: username, password: password } });
        cookies.set('username', username);
        throw redirect(307, '/');
      }
      
    } else {
      // Handle the case when no username is provided
    }
  },
  logout: async ({ request, cookies }) => {
    const username = cookies.get('username');
    if (!username) {
      return fail(400, { username: 'No username detected' });
    }
    cookies.delete('username');
  },
};