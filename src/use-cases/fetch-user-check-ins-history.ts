import { CheckIn } from '@prisma/client';
import { CheckInRepository } from '@/repositories/check-ins-repository';


interface FetchUserCheckInsHistoryUseCaseRequest{
    userId:string;
    page:number;
}


interface FetchUserCheckInsHistoryUseCaseResponse {
    checkIns:CheckIn[]
}
export class FetchUserCheckInsHistoryUseCase{
    constructor(private checkInsRespository: CheckInRepository){
    }
    async execute({userId,page}: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse>{
        const checkIns = await this.checkInsRespository.findManyByUserId(userId,page);

    
   
        return{
            checkIns
        };
    }
}