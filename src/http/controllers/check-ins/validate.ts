
import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case';
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case';
import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

export async function validate(req: FastifyRequest,rep: FastifyReply){
    const validateCheckInParamsSchema = z.object({
        checkInId: z.string()
    });
    


    const {checkInId} = validateCheckInParamsSchema.parse(req.params);

    const validateCheckInUseCase = makeValidateCheckInUseCase();
    await validateCheckInUseCase.execute({
        checkInId
    });    

    return rep.status(204).send();
}