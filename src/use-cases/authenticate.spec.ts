import { describe, it, expect, beforeEach} from 'vitest';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository';
import { AuthenticateUseCase } from './authenticate';
import { hash } from 'bcryptjs';
import { InvalidCredentialsError } from './errors/invalid-credentials-error';



let usersRepository:InMemoryUsersRepository; 
let sut : AuthenticateUseCase;
describe('Authenticate Use Case', ()=>{

    beforeEach(() =>{
        usersRepository = new InMemoryUsersRepository();
        sut = new AuthenticateUseCase(usersRepository);
    });

    it('should be able to authenticate', async () =>{
        usersRepository = new InMemoryUsersRepository();
        sut = new AuthenticateUseCase(usersRepository);

        await usersRepository.create({
            name:'John Doe',
            email:'johndoe@email.com',
            password_hash: await hash('123456', 6)
        });

        const {user} = await sut.execute({
            email:'johndoe@email.com',password:'123456'
        });


        expect(user.id).toEqual(expect.any(String));
    });

    it('should not be able to authenticate with wrong email', async () =>{
        usersRepository = new InMemoryUsersRepository();
        sut = new AuthenticateUseCase(usersRepository);
        await expect(async () => sut.execute({
            email:'johndoe@email.com',password:'123456'
        })).rejects.toBeInstanceOf(InvalidCredentialsError);
    });

    it('should not be able to authenticate with wrong password', async () =>{
        usersRepository = new InMemoryUsersRepository();
        sut = new AuthenticateUseCase(usersRepository);

        await usersRepository.create({
            name:'John Doe',
            email:'johndoe@email.com',
            password_hash: await hash('123456', 6)
        });

        await expect(async () => sut.execute({
            email:'johndoe@email.com',password:'123457'
        })).rejects.toBeInstanceOf(InvalidCredentialsError);
    });


});