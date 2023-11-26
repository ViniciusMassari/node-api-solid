
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository';
import { CheckInUseCase } from '../checkin';
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-respository';

export function makeCheckInUseCase() {
    const repository = new PrismaCheckInsRepository();
    const gymsRepository = new PrismaGymsRepository();
    const useCase= new CheckInUseCase(repository, gymsRepository);

    return useCase;
}