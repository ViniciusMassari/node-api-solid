import { FetchUserCheckInsHistoryUseCase } from '../fetch-user-check-ins-history';
import { GetUserMetricsUseCase } from '../get-user-metrics';
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-respository';

export function makeFetchUserCheckInsUseCase() {
    const repository = new PrismaCheckInsRepository();
    const useCase= new FetchUserCheckInsHistoryUseCase(repository);

    return useCase;
}