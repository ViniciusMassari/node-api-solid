import { CheckInRepository } from '@/repositories/check-ins-repository';
import {describe, it, expect, beforeEach} from 'vitest';
import {FetchUserCheckInsHistoryUseCase} from './fetch-user-check-ins-history';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { GetUserMetricsUseCase } from './get-user-metrics';

describe('GET UseR Metrics Use Case', () =>{
    let checkInsRepository: CheckInRepository;
    let sut: GetUserMetricsUseCase;
    beforeEach(() =>{
        checkInsRepository = new InMemoryCheckInsRepository();
        sut = new GetUserMetricsUseCase(checkInsRepository);
    });

    it('should be able to get check-ins count from metrics', async () =>{
        await checkInsRepository.create({
            gymId: 'gym-01',
            userId:'user-01'
        });
        await checkInsRepository.create({
            gymId: 'gym-02',
            userId:'user-01'
        });

        const {checkInsCount} = await sut.execute({
            userId: 'user-01',
        });

        console.log(checkInsCount);
        

        expect(checkInsCount).toBe(2);
    
    });

  
});