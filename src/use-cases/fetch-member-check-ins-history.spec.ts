import { CheckInRepository } from '@/repositories/check-ins-repository';
import {describe, it, expect, beforeEach} from 'vitest';
import {FetchUserCheckInsHistoryUseCase} from './fetch-user-check-ins-history';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';

describe.only('Fetch User Check-in History Use Case', () =>{
    let checkInsRepository: CheckInRepository;
    let sut: FetchUserCheckInsHistoryUseCase;
    beforeEach(() =>{
        checkInsRepository = new InMemoryCheckInsRepository();
        sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository);
    });

    it('should be able to fetch check-in history', async () =>{
        await checkInsRepository.create({
            gymId: 'gym-01',
            userId:'user-01'
        });
        await checkInsRepository.create({
            gymId: 'gym-02',
            userId:'user-01'
        });

        const {checkIns} = await sut.execute({
            userId: 'user-01',
            page:1
        });

        console.log(checkIns);
        

        expect(checkIns).toHaveLength(2);
        expect(checkIns).toEqual([
            expect.objectContaining({gymId:'gym-01'}),
            expect.objectContaining({gymId:'gym-02'})
        ]);
    });

    it.only('should be able to fetch paginated check-in history', async () =>{
        for (let index = 1; index <= 22; index++) {
            await checkInsRepository.create({
                gymId: `gym-${index}`,
                userId:'user-01'
            });
            
        }
       

        const {checkIns} = await sut.execute({
            userId: 'user-01',
            page:2
        });

        console.log(checkIns);
        

        expect(checkIns).toHaveLength(2);
        expect(checkIns).toEqual([
            expect.objectContaining({gymId:'gym-21'}),
            expect.objectContaining({gymId:'gym-22'})
        ]);
    });
});