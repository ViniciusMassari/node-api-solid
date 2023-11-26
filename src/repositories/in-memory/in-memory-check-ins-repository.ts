import { CheckIn, Prisma} from '@prisma/client';
import { CheckInRepository } from '../check-ins-repository';
import {randomUUID} from 'node:crypto';
import dayjs from 'dayjs';

export class InMemoryCheckInsRepository implements CheckInRepository{
    public items: CheckIn[] = [];
    async findById(id: string): Promise<CheckIn | null> {
        const checkIn=this.items.find(checkIn => checkIn.id === id);
        if(!checkIn){
            return null;
        }
        return checkIn;
    }

    
    async countByUserId(userId: string): Promise<number> {
        return this.items.filter(item => item.userId === userId).length;
    }

    async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
        const checkin = {
            id: randomUUID() as string,
            userId: data.userId,
            gymId: data.gymId,
            validated_at: data.validated_at ? new Date(data.validated_at): null,
            created_at: new Date()
        };

        this.items.push(checkin);
        return checkin;
    }

    async findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn| null> {
        const startOfTheDay = dayjs(date).startOf('date');
        const endOfTheDay = dayjs(date).endOf('date');
        const checkOnSameDate = this.items.find((checkIn) => {
            const checkInDate = dayjs(checkIn.created_at);
            const isOnSameDate = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);
            return  checkIn.userId === userId && isOnSameDate;
        });
        if(!checkOnSameDate){
            return null;
        }
        return checkOnSameDate;
    }

    async findManyByUserId(userId: string, page:number): Promise<CheckIn[]> {
        return this.items.filter(item => item.userId === userId).slice((page-1)*20, page * 20);
    }

    async save(checkIn: CheckIn): Promise<CheckIn> {
        const checkInIndex = this.items.findIndex(item => item.id === checkIn.id);
        if(checkInIndex > -1){
            this.items[checkInIndex] = checkIn;
        }

        return checkIn;
    }

}