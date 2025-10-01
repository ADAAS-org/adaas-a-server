import { A_Command } from "@adaas/a-concept";



export class SignInCommand extends A_Command<{ email: string, password: string }, { token: string }> {

    static get code(): string {
        return 'sign-in';
    }
}