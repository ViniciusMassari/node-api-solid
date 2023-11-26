
import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case';
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function create(req: FastifyRequest,rep: FastifyReply){
    const createCheckInParamsSchema = z.object({
        gymId: z.string()
    });
    
    const createCheckInBodySchema = z.object({
        latitude: z.number().refine(value =>{
            return Math.abs(value) <= 90;
        }),
        longitude: z.number().refine(value =>{
            return Math.abs(value) <= 100;
        })
    });

    const {longitude,latitude} = createCheckInBodySchema.parse(req.body);
    const {gymId} = createCheckInParamsSchema.parse(req.params);

  

    const createGymUseCase = makeCheckInUseCase();
    await createGymUseCase.execute({gymId, userId: req.user.sub,userLatitude:latitude, userLongitude: longitude});

    
    

    return rep.status(201).send();
}