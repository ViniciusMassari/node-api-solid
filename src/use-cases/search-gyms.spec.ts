import {describe, it, expect, beforeEach} from 'vitest';
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gym-repository';
import { SearchGymsUseCase } from './search-gyms';

describe('Fetch User Check-in History Use Case', () =>{
    let gymsRepository: InMemoryGymsRepository;
    let sut: SearchGymsUseCase;
    beforeEach(() =>{
        gymsRepository = new InMemoryGymsRepository();
        sut = new SearchGymsUseCase(gymsRepository);
    });

    it('should be able to search for gyms', async () =>{
        await gymsRepository.create({
            title: 'Javascript gym',
            description: null,
            phone: null,
            latitude:-27.2092052,
            longitude:  -49.6401091,
        });
        await gymsRepository.create({
            title: 'TypeScript gym',
            description: null,
            phone: null,
            latitude:-27.2092052,
            longitude:  -49.6401091,
        });

        const {gyms} = await sut.execute({query:'Javascript',page:1});

        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([
            expect.objectContaining({title:'Javascript gym'}),
        ]);
    });

    it('should be able to fetch paginated gym search', async () =>{
        for (let index = 1; index <= 22; index++) {
            await gymsRepository.create({
                title: `Javascript gym-${index}`,
                description: null,
                phone: null,
                latitude:-27.2092052,
                longitude:  -49.6401091,
            });
            
        }
       

        const {gyms} = await sut.execute({
            query:'Javascript',
            page:2
        });


        

        expect(gyms).toHaveLength(2);
        expect(gyms).toEqual([
            expect.objectContaining({title:'Javascript gym-21'}),
            expect.objectContaining({title:'Javascript gym-22'})
        ]);
    });
});