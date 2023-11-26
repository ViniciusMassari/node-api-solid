import { Gym, Prisma} from '@prisma/client';
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository';
import { randomUUID } from 'node:crypto';
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates';

export class InMemoryGymsRepository implements GymsRepository{
    async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
        return this.items.filter(item => {
            const distance = getDistanceBetweenCoordinates({
                latitude: params.latitude, longitude: params.longitude,
            }, {
                latitude: item.latitude.toNumber(), longitude: item.longitude.toNumber()
            });

            return distance < 10;
        });
    }
   
    async  searchMany(query: string, page: number): Promise<Gym[]> {
        return this.items.filter(item => item.title.includes(query)).slice((page-1)*20, page * 20);
    }
    public items: Gym[] = [];
    async findById(id: string): Promise<Gym | null> {
        const gym = this.items.find(item => item.id === id);
        if(!gym){
            return null;
        }
        return gym;
    }

    async create(data: Prisma.GymCreateInput): Promise<Gym>{
        const gym = {
            id: data.id ?? randomUUID() as string,
            title: data.title,
            description: data.description ?? null,
            latitude:  new Prisma.Decimal(data.latitude.toString()),
            longitude: new Prisma.Decimal(data.longitude.toString()),
            phone: data.phone ?? null,
        };

        this.items.push(gym);
        return gym;
    }
 

   
}