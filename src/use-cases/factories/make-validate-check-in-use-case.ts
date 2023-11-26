
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-respository';
import { ValidateCheckInUseCase } from '../validate-check-in';

export function makeValidateCheckInUseCase() {
    const repository = new PrismaCheckInsRepository();
    const useCase= new ValidateCheckInUseCase(repository);

    return useCase;
}