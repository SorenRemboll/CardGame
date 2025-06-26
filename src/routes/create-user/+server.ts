import { DBClient } from '$lib/prisma';
import { Prisma } from '@prisma-app/client';
import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import bcrypt from "bcrypt";

export const POST:RequestHandler = async({request}) => {
		const {email,password,username}:{email:string,password:string,username:string} = await request.json();
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        try {
            const user = await DBClient.user.create({
                data: {
                    email,
                    userName: username,
                    password:passwordHash
                }
            });
            return json({ success: true});
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                
                if (e.code === 'P2002') {
                    return error( 409, { message: 'Email or username already exists' });
                }
                return error( 500, { message: 'Internal Server Error' });

            }
        } 
        return json({ })
	} 
