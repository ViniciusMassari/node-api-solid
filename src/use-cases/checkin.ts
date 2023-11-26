import { CheckIn, User } from '@prisma/client';
import { CheckInRepository } from '@/repositories/check-ins-repository';
import { GymsRepository } from '@/repositories/gyms-repository';
import { ResourceNotFound } from './errors/resource-not-found-error';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';
import { MaxDistanceError } from './errors/max-distance-error';
import { MaxNumberOfCheckIns } from './errors/max-number-of-check-ins';


interface CheckInUseCaseRequest{
    userId:string;
    gymId:string;
    userLatitude: number;
    userLongitude: number;
}


interface CheckInUseCaseResponse {
    checkin:CheckIn
}
export class CheckInUseCase{
    constructor(private checkInsRespository: CheckInRepository, private gymsRepository: GymsRepository){
    }
    async execute({gymId, userId,userLatitude,userLongitude}: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse>{
        const gym = await this.gymsRepository.findById(gymId);

        if(!gym){
            throw new ResourceNotFound();  
        }

        const distance = getDistanceBetweenCoordinates({latitude: userLatitude, longitude: userLongitude},{latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber()});
        const MAX_DISTANCE_IN_KILOMETERS = 0.1;
        if(distance > MAX_DISTANCE_IN_KILOMETERS){
            throw new MaxDistanceError();
        }
        const checkInOnSameDay = await this.checkInsRespository.findByUserIdOnDate(userId, new Date());
        if(checkInOnSameDay){
            throw new MaxNumberOfCheckIns(); 
        }
        const checkin = await this.checkInsRespository.create({
            gymId,
            userId
        });
   
        return{
            checkin
        };
    }
}