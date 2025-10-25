import { A_Command } from "@adaas/a-utils";



export class SignInCommand extends A_Command<{ email: string, password: string }, { token: string }> {

    static get entity(): string {
        return 'sign-in';
    }
}