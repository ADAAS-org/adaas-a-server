import { A_Component, A_Container, A_Inject, A_Scope } from "@adaas/a-concept";
import { A_Router } from "../A-Router/A-Router.component";
import { A_Request } from "@adaas/a-server/entities/A-Request/A-Request.entity";
import { A_Response } from "@adaas/a-server/entities/A-Response/A-Response.entity";
import { A_Command } from "@adaas/a-utils";


export class A_CommandController extends A_Component {

    @A_Router.Get({
        path: "/:command/execute",
        version: "v1",
        prefix: "a-command"
    })
    async handleCommand(
        @A_Inject(A_Request) req: A_Request<any, any, { command: string }>,
        @A_Inject(A_Response) res: A_Response,
        @A_Inject(A_Scope) scope: A_Scope,
        @A_Inject(A_Container) container: A_Container,
    ): Promise<void> {

        const commandName = req.params.command;

        const CommandConstructor = scope.resolveConstructor<A_Command>(commandName);

        if (!CommandConstructor) {
            res.status(404);

            throw new Error(`Command ${commandName} not found`);
        }

        const command = new CommandConstructor(req.body);

        container.scope.register(command);

        await command.execute();

        const serialized = command.toJSON();

        return res.status(200).json(serialized);
    }

}