
import {afterAll, beforeAll, describe, expect, it} from 'vitest';
import {app} from '@/app';
import request from 'supertest';

describe('Authenticate (e2e)', () =>{
    beforeAll(async () =>{
        await app.ready();
    });

    afterAll(async () =>{
        await app.close();
    });
    
    it('should de able to register', async () =>{ 
        await request(app.server)
            .post('/user')
            .send({
                name:'John Doe',
                email: 'johndoe@email.com',
                password: '123456'
            });

        const response =   await request(app.server)
            .post('/sessions')
            .send({
                email: 'johndoe@email.com',
                password: '123456'
            });

        expect(response.statusCode).toEqual(200);
        expect(response.body).toEqual({
            token: expect.any(String)
        });
    });
});