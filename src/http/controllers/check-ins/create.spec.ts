
import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import {app} from '@/app';
import request from 'supertest';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import { prisma } from '@/lib/prisma';


describe.only('Create check-ins (e2e)', () =>{
    beforeAll(async () =>{
        await app.ready();
    });

    afterAll(async () =>{
        await app.close();
    });
    
    it('should de able to create a check-in', async () =>{ 
        const {token} = await createAndAuthenticateUser(app);
       
        const gym = await prisma.gym.create({
            data:{
                title: 'JavaScript Gym',
                latitude: -27.2092052,
                longitude: -49.6401091
            }
        });

        const response = await request(app.server)
            .get(`/gyms/${gym.id}/check-ins`).query({
                latitude:-27.2092052,
                longitude:  -49.6401091,
            }).set('Authorization', `Bearer ${token}`).send({
                latitude: -27.2092052,
                longitude: -49.6401091
            }).send();

        expect(response.status).toEqual(201);
        
    });
});