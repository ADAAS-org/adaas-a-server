import { A_Service } from '@adaas/a-server/containers/A-Service/A-Service.container';

jest.retryTimes(0);


describe('A-Server Tests', () => {
    it('Should be possible to create a server Container', async () => {
        const server1 = new A_Service({
            name: 'test-server-1'
        });

        await server1.load();

        expect(server1.name).toBe('test-server-1');
        expect(server1.port).toBe(3000);
    });

});