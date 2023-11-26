import { CheckIn } from '@prisma/client';
import { CheckInRepository } from '@/repositories/check-ins-repository';
import { ResourceNotFound } from './errors/resource-not-found-error';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';
import { MaxDistanceError } from './errors/max-distance-error';
import { MaxNumberOfCheckIns } from './errors/max-number-of-check-ins';
import dayjs from 'dayjs';
import { LateCheckInValidationError } from './errors/late-check-in-validation-error';


interface ValidateCheckInUseCaseRequest{
    checkInId: string
}


interface ValidateCheckInUseCaseResponse {
    checkIn:CheckIn
}
export class ValidateCheckInUseCase{
    constructor(private checkInsRespository: CheckInRepository){
    }
    async execute({checkInId}: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse>{
        const checkIn = await this.checkInsRespository.findById(checkInId);

        if(!checkIn){
            throw new ResourceNotFound();
        }
        const distanceInMinutesFromCheckInCreation =  dayjs(new Date()).diff(checkIn.created_at, 'minutes');
        if(distanceInMinutesFromCheckInCreation > 20){
            throw new LateCheckInValidationError();   
        }
       
        checkIn.validated_at = new Date();

        await this.checkInsRespository.save(checkIn);

        return{
            checkIn
        };
    }
}