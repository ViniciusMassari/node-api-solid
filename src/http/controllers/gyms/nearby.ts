
import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function nearby(req: FastifyRequest,rep: FastifyReply){

    const nearbyGymsQuerySchema = z.object({
        latitude: z.coerce.number().refine(value =>{
            return Math.abs(value) <= 90;
        }),
        longitude: z.coerce.number().refine(value =>{
            return Math.abs(value) <= 100;
        })
    });

    const {latitude,longitude} = nearbyGymsQuerySchema.parse(req.params);
    console.log(req.params);


    const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase();
    const {gyms} = await fetchNearbyGymsUseCase.execute({userLatitude:latitude,userLongitude:longitude});

    
    

    return rep.status(201).send({
        gyms
    });
}