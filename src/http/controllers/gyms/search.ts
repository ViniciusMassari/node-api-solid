
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case';
import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function search(req: FastifyRequest,rep: FastifyReply){

    const searchGymsQuerySchema = z.object({
        query: z.string(),
        page: z.coerce.number().min(1).default(1)
    });

    const {page,query} = searchGymsQuerySchema.parse(req.query);

  

    const searchGymsUseCase = makeSearchGymsUseCase();
    const {gyms} = await searchGymsUseCase.execute({query,page});

    
    

    return rep.status(200).send({
        gyms
    });
}