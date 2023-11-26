import { describe, it, expect, beforeEach, vi, afterEach} from 'vitest';
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository';
import { CheckInUseCase } from './checkin';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gym-repository';
import { Decimal } from '@prisma/client/runtime/library';
import { MaxNumberOfCheckIns } from './errors/max-number-of-check-ins';
import { MaxDistanceError } from './errors/max-distance-error';





let checkInRepository:InMemoryCheckInsRepository; 
let gymsRepository: InMemoryGymsRepository;
let sut : CheckInUseCase;

describe.only('Check-in Use Case', () =>{
    beforeEach(() =>{
        checkInRepository = new InMemoryCheckInsRepository();
        gymsRepository = new InMemoryGymsRepository();
        sut = new CheckInUseCase(checkInRepository, gymsRepository);
        vi.useFakeTimers();

        gymsRepository.create({
            id:'gym-01',
            title: 'JavaScript Gym',
            description: '',
            phone : '',
            latitude: -27.2092052,
            longitude: -49.6401091
        });
    });

    afterEach(() =>{
        vi.useRealTimers();
    });

    it('should be able to check-in', async () =>{
        const {checkin} = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude:-27.2092052,
            userLongitude: -49.6401091,
        });
        
        expect(checkin.id).toEqual(expect.any(String));
    });

    it('should not be able to check in twice in the same day', async () =>{
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
   
        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude:-27.2092052,
            userLongitude:  -49.6401091,
        });

        await expect(() => sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude:-27.2092052,
            userLongitude:  -49.6401091,
        })).rejects.toBeInstanceOf(MaxNumberOfCheckIns);
    });

    it('should be able to check in twice but in different days', async () =>{
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));
   
        await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -27.2092052,
            userLongitude: -49.6401091
        });

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));
        const {checkin} = await sut.execute({
            gymId: 'gym-01',
            userId: 'user-01',
            userLatitude: -27.2092052,
            userLongitude: -49.6401091
        });

        expect(checkin.id).toEqual(expect.any(String));
    });


    it('should not be able to check in on a distant gym', async () =>{
        gymsRepository.items.push({
            id:'gym-02',
            title: 'JavaScript Gym',
            description: '',
            phone : '',
            latitude: new Decimal(-27.0747279),
            longitude: new Decimal(-49.4889672)
        });
       
       
        await expect(async () =>{
            await  sut.execute({
                gymId: 'gym-02',
                userId: 'user-01',
                userLatitude: -23.6276817,
                userLongitude: -46.4624999
            });
        }).rejects.toBeInstanceOf(MaxDistanceError);
        
    });
});