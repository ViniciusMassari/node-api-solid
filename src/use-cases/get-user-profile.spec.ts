import { describe, it, expect, beforeEach} from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { hash } from 'bcryptjs';
import { GetUserProfileUseCase } from './get-user-profile';
import { ResourceNotFound } from './errors/resource-not-found-error';


let usersRepository:InMemoryUsersRepository; 
let sut : GetUserProfileUseCase;
describe('Get user profile Use Case', ()=>{

    beforeEach(() =>{
        usersRepository = new InMemoryUsersRepository();
        sut = new GetUserProfileUseCase(usersRepository);
    });

    it('should be able to get user profile', async () =>{
        usersRepository = new InMemoryUsersRepository();
        sut = new GetUserProfileUseCase(usersRepository);

        const {id} = await usersRepository.create({
            name:'John Doe',
            email:'johndoe@email.com',
            password_hash: await hash('123456', 6)
        });

        const {user} = await sut.execute({
            userId:id
        });


        expect(user.id).toEqual(expect.any(String));
        expect(user.name).toEqual('John Doe');
    });


    it('should not be able to get user profile', async () =>{
        usersRepository = new InMemoryUsersRepository();
        sut = new GetUserProfileUseCase(usersRepository);

       

        await expect(() => sut.execute({
            userId:'non-existent-id' 
        })).rejects.toBeInstanceOf(ResourceNotFound);
    });

  


});