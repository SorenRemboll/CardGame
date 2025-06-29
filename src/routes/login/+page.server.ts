import { DBClient } from '$lib/prisma';
import { error, isHttpError, json, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import bcrypt from "bcrypt"
import { Prisma, type User } from '@prisma-app/client';
import { COOKIE_NAME } from '$env/static/private';
import { ROUTES } from '$lib/consts/routes';

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.user) {
        return redirect(307, ROUTES.CHARACTER);
    }
}

export const actions = {
	login: async ({ cookies, request,locals}) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		const rawPassword = data.get('password') as string;
        let user:null | User = null
        try {
            user = await DBClient.user.findUnique({
                where:{
                    email:email,
                }
            });
        } catch (e) {                        
            if(isHttpError(e)){
                return error(e.status,e.body)
            }            
            return error(500, {message:'Error?'})
        }
        if(!user){
            return error(404,{message:'User not found'})
        }
        const isPasswordMatching = bcrypt.compareSync(rawPassword,user.password);
        if(!isPasswordMatching){
            return error(404,{message:'User not found'})
        }
        //success
        locals.user = user;
        cookies.set(COOKIE_NAME, user.sessionID,{path:'/',})
        return redirect(307,ROUTES.CHARACTER);
	}
} satisfies Actions;