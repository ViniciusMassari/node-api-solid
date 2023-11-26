import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error';
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function authenticate(req: FastifyRequest,rep: FastifyReply){

    const authenticateBodySchema = z.object({
        email:z.string().email(),
        password:z.string().min(6)
    });

    const {email,password} = authenticateBodySchema.parse(req.body);

    try {
     
        const authenticateUseCase= makeAuthenticateUseCase();

        const {user} =  await authenticateUseCase.execute({email,password});

        const token = await rep.jwtSign(
            {
                role: user.role  
            }, {
                sign:{
                    sub: user.id
                }
            });

        const refreshToken = await rep.jwtSign(
            {
                role: user.role  
            }, {
                sign:{
                    sub: user.id,
                    expiresIn: '7d'
                }
            });

        return rep.status(200).setCookie('refreshToken', refreshToken,{
            path: '/',
            secure: true,
            sameSite: true,
            httpOnly: true
        }).
            send({
                token
            });


    } catch (error) {
        if(error instanceof InvalidCredentialsError){
            return rep.status(400).send({
                message: error.message
            });
        }
        throw error;
        
    }
    

}