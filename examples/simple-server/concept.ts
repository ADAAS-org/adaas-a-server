import { A_EntityController } from "@adaas/a-server/components/A-EntityController/A-EntityController.component"
import { A_Router } from "@adaas/a-server/components/A-Router/A-Router.component"
import { A_ServerContainer } from "@adaas/a-server/containers/A-Server/A-Server.container"
import { A_EntityFactory } from "@adaas/a-server/context/A-EntityFactory/A-EntityFactory.context"
import { User } from "./entities/User/User.entity"
import { A_ServerLogger } from "@adaas/a-server/components/A-ServerLogger/A_ServerLogger.component"
import {
    A_Concept,
    A_Config,
    A_ConfigLoader,
    A_ErrorsManager,
    ConfigReader,
    ENVConfigReader,
    FileConfigReader
} from "@adaas/a-concept"
import { UsersRepository } from "./components/Users.repository"
import { TestController } from "./components/Test.controller"
import { A_ServerHealthMonitor } from "@adaas/a-server/components/A-ServerHealthMonitor/A-ServerHealthMonitor.component"
import { A_ProxyConfig } from "@adaas/a-server/context/A_ProxyConfig/A_ProxyConfig.context"
import { A_ServerProxy } from "@adaas/a-server/components/A-ServerProxy/A-ServerProxy.component"
import { A_ServerCORS } from "@adaas/a-server/components/A-ServerCORS/A_ServerCORS.component"
import { A_StaticLoader } from "@adaas/a-server/components/A-StaticLoader/A-StaticLoader.component"
import { A_StaticConfig } from "@adaas/a-server/context/A-StaticConfig/A-StaticConfig.context"
import { UserDoingComponent } from "./components/UserDoing.component"
import { A_Controller } from "@adaas/a-server/components/A_Controller/A_Controller.component"
import { A_ListingController } from "@adaas/a-server/components/A-ListingController/A-ListingController.component"



(async () => {
    const config = new A_Config({
        variables: ['PORT', 'A_ROUTER__PARSE_PARAMS_AUTOMATICALLY', 'CONFIG_VERBOSE', 'DEV_MODE'],
        defaults: {
            PORT: 3000,
            A_ROUTER__PARSE_PARAMS_AUTOMATICALLY: true,
            CONFIG_VERBOSE: true,
            DEV_MODE: true
        }
    });

    const SharedConfig = new A_ConfigLoader({
        components: [
            ConfigReader,
            FileConfigReader,
            ENVConfigReader
        ],
        fragments: [config]
    });


    const Server = new A_ServerContainer({
        name: 'simple-server2',
        components: [
            A_ErrorsManager,
            A_ServerLogger,
            A_Router,
            A_EntityController,
            UsersRepository,
            TestController,
            A_ServerHealthMonitor,
            UserDoingComponent,
            A_ServerProxy,
            A_StaticLoader,
            A_Controller,
            A_ServerCORS,
            A_ListingController
        ],
        fragments: [
            config,
            new A_EntityFactory({
                'user': User
            })
        ]
    });

    const user1 = new User({
        id: 2,
        name: 'Jane Doe',
        email: 'jane@doe.com'
    });
    const user2 = new User({
        id: 3,
        name: 'John Doe',
        email: 'john@doe.com'
    });

    console.log('user1: ', user1.aseid.toString());
    console.log('user2: ', user2.aseid.toString());

    const concept = new A_Concept({
        name: 'simple-server-concept',
        containers: [SharedConfig, Server],
        fragments: [
            config,
            new A_ProxyConfig({
                '/paths': 'https://test.com',
                '/assets/.*': 'https://test.com',
                '/style.css': 'https://test.com'
            }),
            new A_StaticConfig(['docs'])
        ],
        entities: []
    });


    await concept.load();
    await concept.start();
})()