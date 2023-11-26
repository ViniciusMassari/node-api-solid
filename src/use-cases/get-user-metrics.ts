import { CheckIn } from '@prisma/client';
import { CheckInRepository } from '@/repositories/check-ins-repository';


interface GetUserMetricsUseCaseRequest{
    userId:string;
}


interface GetUserMetricsUseCaseResponse {
    checkInsCount: number
}
export class GetUserMetricsUseCase{
    constructor(private checkInsRespository: CheckInRepository){
    }
    async execute({userId}: GetUserMetricsUseCaseRequest): Promise<GetUserMetricsUseCaseResponse>{
        const checkInsCount = await this.checkInsRespository.countByUserId(userId);

    
   
        return{
            checkInsCount
        };
    }
}