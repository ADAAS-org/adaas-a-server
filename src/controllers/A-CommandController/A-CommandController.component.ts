import { A_Component, A_Container, A_Inject, A_Scope } from "@adaas/a-concept";
import { A_ServerRouter } from "@adaas/a-server/router/A-ServerRouter.component";
import { A_Request } from "@adaas/a-server/request/A-Request.entity";
import { A_Response } from "@adaas/a-server/response/A-Response.entity";
import { A_ServerError } from "../../lib/A-Server/A-Server.error";
import { A_Logger } from "@adaas/a-utils/a-logger";
import { A_Command } from "@adaas/a-utils/a-command";


export class A_CommandController extends A_Component {

    @A_ServerRouter.Post({
        path: "/:command",
        version: "v1",
        prefix: "a-command"
    })
    async handleCommand(
        @A_Inject(A_Request) req: A_Request<any, any, { command: string }>,
        @A_Inject(A_Response) res: A_Response,
        @A_Inject(A_Scope) scope: A_Scope,
        @A_Inject(A_Container) container: A_Container,
        @A_Inject(A_Logger) logger: A_Logger,
    ): Promise<void> {

        const commandName = req.params.command;

        const CommandConstructor = scope.resolveConstructor<A_Command>(commandName);

        if (!CommandConstructor) {
            res.status(404);

            throw new A_ServerError({
                title: 'Command Not Found',
                description: `Command constructor for ${commandName} not found`,
                status: 404,
            });
        }

        const command = new CommandConstructor(req.body);

        scope.register(command);

        await command.execute();

        const serialized = command.toJSON();

        return res.status(200).send(serialized);
    }
}