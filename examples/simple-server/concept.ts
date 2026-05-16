// import { A_CommandController, A_Controller, A_EntityController, A_ListingController, A_ProxyConfig, A_Router, A_ServerCORS, A_ServerHealthMonitor, A_ServerLogger, A_ServerProxy, A_Service, A_StaticConfig, A_StaticLoader } from "../../src"
import { A_Concept, A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY } from "@adaas/a-concept";
import { A_EntityController } from "@adaas/a-server/controllers/A-EntityController/A-EntityController.component";
import { A_ServerLogger } from "@adaas/a-server/logger/A-ServerLogger.component";
import { A_Config, ENVConfigReader } from "@adaas/a-utils/a-config";
import { A_Polyfill } from "@adaas/a-utils/a-polyfill";
import { UsersRepository } from "./components/Users.repository";
import { TestController } from "./components/Test.controller";
import { A_ServerHealthMonitor } from "@adaas/a-server/controllers/A-ServerHealthMonitor/A-ServerHealthMonitor.component";
import { UserDoingComponent } from "./components/UserDoing.component";
import { A_ServerProxy } from "@adaas/a-server/proxy/A-ServerProxy.component";
import { A_ProxyConfig } from "@adaas/a-server/proxy/A-ServerProxy.context";
import { A_StaticLoader } from "@adaas/a-server/static/A-ServerStatic.component";
import { A_StaticConfig } from "@adaas/a-server/static/A-ServerStatic.context";
import { A_ServerController } from "@adaas/a-server/controller/A-ServerController.component";
import { A_ServerCORS } from "@adaas/a-server/middlewares/A-ServerCORS/A_ServerCORS.component";
import { A_ListingController } from "@adaas/a-server/controllers/A-ListingController/A-ListingController.component";
import { A_CommandController } from "@adaas/a-server/controllers/A-CommandController/A-CommandController.component";
import { A_HttpServer } from "@adaas/a-server/server/A-HttpServer.container";
import { SignInCommand } from "./commands/SignIn.command";
import { A_ServerRouter } from "@adaas/a-server/router/A-ServerRouter.component";
import { User } from "./entities/User/User.entity";




(async () => {

    const Server = new A_HttpServer({
        name:'simple-server',
        components: [
            A_Polyfill,
            A_ServerLogger,
            ENVConfigReader,
            A_ServerRouter,
            A_EntityController,
            UsersRepository,
            TestController,
            A_ServerHealthMonitor,
            UserDoingComponent,
            A_ServerProxy,
            A_StaticLoader,
            A_ServerController,
            A_ServerCORS,
            A_ListingController,
            A_CommandController,

        ],
        entities: [
            // commands
            SignInCommand,
            User
        ],
        fragments: [
            new A_Config({
                variables: [
                    ...A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY,
                    'A_SERVER_PORT', 'A_ROUTER__PARSE_PARAMS_AUTOMATICALLY', 'CONFIG_VERBOSE', 'DEV_MODE'
                ] as const,
                defaults: {
                    A_SERVER_PORT: 3000,
                    A_ROUTER__PARSE_PARAMS_AUTOMATICALLY: true,
                    CONFIG_VERBOSE: true,
                    DEV_MODE: true
                }
            }),
            new A_ProxyConfig({
                '/paths': 'https://adaas.org/index.html',
                '/assets/.*': 'https://test.com',
                '/style.css': 'https://test.com'
            }),
            new A_StaticConfig(
                ['./public', './assets'], // Simple directories
                [ // Custom aliases
                    { path: '/api-docs', directory: './docs', alias: '/documentation' },
                    { path: '/assets', directory: './static/assets' },
                    { path: '/uploads', directory: './user-uploads' }
                ]
            )
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
        containers: [Server],
        components: [],
        fragments: [],
        entities: []
    });



    await concept.load();
    await concept.start();
})()