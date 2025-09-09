import { A_ARC_MaskQueryBuilder } from '@adaas/a-arc';
import { A_EXPRESS_App } from '@adaas/a-sdk/global/A_EXPRESS_App.class';
import { config } from 'dotenv';
config();
jest.retryTimes(0);


describe('App', () => {
    it('Should create an app', async () => {
        const app = new A_EXPRESS_App({
            app: {
                name: 'test',
            },
            context: {
                namespace: 'test',
                errors: []
            },
            routes: [
                {
                    version: 'v1',
                    controllers: []
                }
            ],
        });

        await app.start();
    });

});