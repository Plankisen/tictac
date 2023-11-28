import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { PrismaClient } from '@prisma/client';
import * as crypto from "crypto";

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
        if (validatePassword(password, existingUser.salt, existingUser.hash)) {
          cookies.set("username", username, { secure: false });
          const token = await prisma.token.create({
            data: { userId: existingUser.id },
          });
          cookies.set("token_id", token.id, { secure: false });
          throw redirect(307, "/");
          
        }

      }
      else {
        const { salt, hash } = hashPassword(password);
        await prisma.user.create({
          data: {
            name: username,
            salt: salt,
            hash: hash,
          },
        });
        let token_id = cookies.get("token_id");
        if (token_id) {
          throw redirect(303, "/");
        }
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
    let token = cookies.get("token_id");
    cookies.delete("token_id");
    await prisma.token.delete({ where: { id: token } });
    if (!token) {
      throw redirect(307, "/login"); // login
    }
  },
};

function hashPassword(password : crypto.BinaryLike) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

function validatePassword(inputPassword : crypto.BinaryLike, storedSalt : crypto.BinaryLike, storedHash : string) {
  const hash = crypto.pbkdf2Sync(inputPassword, storedSalt, 1000, 64, 'sha512').toString('hex');
  return storedHash === hash;
}