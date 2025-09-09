import { A_ServerContainer } from "@adaas/a-server/containers/A-Server/A-Server.container"
import { A_Server } from "@adaas/a-server/context/A-Server/A_Server.context"
import { User } from "./entities/User.entity";
import { A_EntityFactory } from "@adaas/a-server/context/A-EntityFactory/A-EntityFactory.context";


(async () => {

    const server = new A_Server({
        name: 'server',
        version: 'v1',
        port: 3000
    })


    const usersService = new A_ServerContainer({
        components: [

        ],
        fragments: [
            server,
            new A_EntityFactory({
                'users': User
            })
        ]
    });

    const ordersService = new A_ServerContainer({
        components: [],
        
        fragments: [
            server,
            new A_EntityFactory({
                'some': User
            })
        ]
    });



    await usersService.start();
    await ordersService.start();
})