import { UsersRepository } from '@/repositories/usersRepository';

import { User } from '@prisma/client';
import { ResourceNotFound } from './errors/resource-not-found-error';


interface GetUserProfileRequest{
    userId:string;
}


interface GetUserProfileResponse {
    user:User
}
export class GetUserProfileUseCase{
    constructor(private usersRepository: UsersRepository){
    }
    async execute({userId}: GetUserProfileRequest): Promise<GetUserProfileResponse>{
        const user = await this.usersRepository.findById(userId);

        if(!user){
            throw new ResourceNotFound(); 
        }


        return{
            user
        };
    }
}