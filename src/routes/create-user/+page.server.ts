import { prisma } from '$lib/prisma';
import { Prisma, type User } from '@prisma-app/client';
import { error, json, type Actions } from '@sveltejs/kit';
import bcrypt from "bcrypt";

export const actions = {
    signup: async({cookies,request,}) => {
		const data = await request.formData();
        const email = data.get('email') as string;
        const password = data.get('password') as string;
        const username = data.get('username') as string;
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const sessionId = await bcrypt.hash(crypto.randomUUID(),2)
        try {
            const user = await prisma.user.create({
                data: {
                    email,
                    userName: username,
                    password:passwordHash,
                    sessionID: sessionId,
                }
            });
           return { user };
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                
                if (e.code === 'P2002') {
                    return error( 409, { message: 'Email or username already exists' });
                }
                return error( 500, { message: 'Internal Server Error' });

            }
        } 
	}
} satisfies Actions;
