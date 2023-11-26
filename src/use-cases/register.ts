/* eslint-disable @typescript-eslint/no-explicit-any */
import { UsersRepository } from '@/repositories/usersRepository';
import { hash } from 'bcryptjs';
import { UserAlreadyExistsError } from './errors/user-already-exists-error';
import { User } from '@prisma/client';

interface RegisterUseCaseRequest{
    name:string;
    email:string;
    password:string;
}

interface RegisterUseCaseResponse{
    user: User
}

export class RegisterUseCase{

    constructor(private userRepository: UsersRepository){  
    }
    async execute({name,email,password}:RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
        const SALT= 6;
        const userWithSameEmail = await this.userRepository.findByEmail(email);

        if(userWithSameEmail) {
            throw new UserAlreadyExistsError();
        }
        const password_hash = await hash(password, SALT);
        const user = await this.userRepository.create({name,email,password_hash});

        return {user};
    }
}

