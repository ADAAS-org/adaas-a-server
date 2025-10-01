import { A_Service } from '@adaas/a-server/containers/A-Service/A-Service.container';
import { A_Server } from '@adaas/a-server/context/A-Server/A_Server.context';

jest.retryTimes(0);


describe('A-Server Tests', () => {
    it('Should be possible to create a server Container', async () => {
        const server1 = new A_Service({
            name: 'test-server-1'
        });

        await server1.load();

        expect(server1.name).toBe('test-server-1');
        expect(server1.Scope.resolve(A_Server)).toBeInstanceOf(A_Server);
        expect(server1.Scope.resolve(A_Server).port).toBe(3000);
    });

});