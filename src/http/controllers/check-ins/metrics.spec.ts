
import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import {app} from '@/app';
import request from 'supertest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';


describe('Check-in Metrics (e2e)', () =>{
    beforeAll(async () =>{
        await app.ready();
    });

    afterAll(async () =>{
        await app.close();
    });
    
    it('should de able to get the check-ins total count', async () =>{ 
        const {token} = await createAndAuthenticateUser(app);

        const user = await prisma.gym.findFirstOrThrow();
       
        const {id} = await prisma.gym.create({
            data:{
                title: 'JavaScript Gym',
                latitude: -27.2092052,
                longitude: -49.6401091
            }
        });

        const checkIns = await prisma.checkIn.createMany({
            data:[{
                gymId: id,
                userId: user.id
            },
            { gymId: id,
                userId: user.id
            }
            ]
        });

        const response = await request(app.server)
            .get('/check-ins/metrics')
            .set('Authorization', `Bearer ${token}`)
            .send();

        expect(response.status).toEqual(201);
        expect(response.body.checkInsCount).toEqual(2);
        
    });
});