/* eslint-disable @typescript-eslint/no-explicit-any */
import { Gym } from '@prisma/client';
import { GymsRepository } from '@/repositories/gyms-repository';

interface CreateGymUseCaseRequest{
    title:string;
    description?:string | null;
    phone: string | null;
    latitude: number;
    longitude: number;
}

interface CreateGymUseCaseResponse{
    gym: Gym
}

export class CreateGymUseCase{

    constructor(private gymRepository: GymsRepository){  
    }
    async execute({title,description,phone,longitude,latitude}:CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
       
        const gym = await this.gymRepository.create({title,description,phone,longitude,latitude});

        return {gym};
    }
}

