import { describe, it, expect, beforeEach, vi, afterEach} from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gym-repository';
import { ValidateCheckInUseCase } from './validate-check-in';
import { ResourceNotFound } from './errors/resource-not-found-error';
import { LateCheckInValidationError } from './errors/late-check-in-validation-error';





let checkInRepository:InMemoryCheckInsRepository; 
let gymsRepository: InMemoryGymsRepository;
let sut : ValidateCheckInUseCase;

describe.only('Validate Check-in Use Case', () =>{
    beforeEach(() =>{
        checkInRepository = new InMemoryCheckInsRepository();
       
        sut = new ValidateCheckInUseCase(checkInRepository);
        vi.useFakeTimers();

     
    });

    afterEach(() =>{
        vi.useRealTimers();
    });

    it('should be able to validate the check-in', async () =>{
        const createdCheckIn = await checkInRepository.create({
            gymId: 'gym-01',
            userId: 'user-01',
        });
        const {checkIn} = await sut.execute({
            checkInId: createdCheckIn.id
        });
        
        expect(checkIn.validated_at).toEqual(expect.any(Date));
        expect(checkInRepository.items[0].validated_at).toEqual(expect.any(Date));
    });


    it('should not be able to validate a inexistent check-in', async () =>{
        await expect(async () =>{
            await sut.execute({
                checkInId: 'inexistent-check-in-id'
            }); 
        }).rejects.toBeInstanceOf(ResourceNotFound);
    });

    
    it('should not be able to validate the check-in after 20 minutes of its creation', async () =>{
        vi.setSystemTime(new Date(2023,0,1,13,40));
        const createdCheckIn = await checkInRepository.create({
            gymId: 'gym-01',
            userId: 'user-01',
        });
        const {checkIn} = await sut.execute({
            checkInId: createdCheckIn.id
        });

        const twentyOneMinutesInMs =  1000 * 60 * 21;
        vi.advanceTimersByTime(twentyOneMinutesInMs);

        await expect(async () =>{
            await sut.execute({
                checkInId: createdCheckIn.id
            }); 
        }).rejects.toBeInstanceOf(LateCheckInValidationError);
    });


});