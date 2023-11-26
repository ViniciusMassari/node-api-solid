
import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import {app} from '@/app';
import request from 'supertest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';


describe.only('Validate check-ins (e2e)', () =>{
    beforeAll(async () =>{
        await app.ready();
    });

    afterAll(async () =>{
        await app.close();
    });
    
    it('should de able to create a check-in', async () =>{ 
        const {token} = await createAndAuthenticateUser(app, true);
        const user = await prisma.user.findFirstOrThrow();

       
        const gym = await prisma.gym.create({
            data:{
                title: 'JavaScript Gym',
                latitude: -27.2092052,
                longitude: -49.6401091
            }
        });

        let checkIn = await prisma.checkIn.create({
            data:{
                gymId: gym.id,
                userId: user.id
            }
        });

        const response = await request(app.server)
            .patch(`/check-ins/${checkIn.id}/validate`).set('Authorization', `Bearer ${token}`).send();

        expect(response.status).toEqual(204);

        checkIn = await prisma.checkIn.findUniqueOrThrow({
            where:{
                id: checkIn.id
            }
        });

        expect(checkIn.validated_at).toEqual(expect.any(Date));
        
    });
});