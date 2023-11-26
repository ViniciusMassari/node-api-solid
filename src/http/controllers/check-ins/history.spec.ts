
import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import {app} from '@/app';
import request from 'supertest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';


describe('Check-ins history (e2e)', () =>{
    beforeAll(async () =>{
        await app.ready();
    });

    afterAll(async () =>{
        await app.close();
    });
    
    it('should de able to list the history of check-in', async () =>{ 
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
            .get('/check-ins/history')
            .set('Authorization', `Bearer ${token}`).send();

        expect(response.status).toEqual(200);
        expect(response.body.checkIns).toEqual([
            expect.objectContaining({
                gymId: id,
                userId: user.id
            }),
            expect.objectContaining({
                gymId: id,
                userId: user.id
            }),
        ]);
        
    });
});