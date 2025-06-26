import { DBClient } from '$lib/prisma';
import { error, isHttpError, json } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import bcrypt from "bcrypt"
import { Prisma } from '@prisma-app/client';

export const actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		const rawPassword = data.get('password') as string;
        try {
            const matchingEmail = await DBClient.user.findUnique({
                where:{
                    email:email,
                }
            });
            if(!matchingEmail){
                return error(404,{message:'User not found'})
            }
            const isPasswordMatching = bcrypt.compareSync(rawPassword,matchingEmail.password);
            if(!isPasswordMatching){
                return error(404,{message:'User not found'})
            }
            return json({
                success:true,
                user_id:matchingEmail.id,
            })
        } catch (e) {    
            console.log(e);
                    
            if(isHttpError(e)){
                return error(e.status,e.body)
            }            
            return error(500, {message:'Error?'})
        }
        
		return { success: true };
	}
} satisfies Actions;