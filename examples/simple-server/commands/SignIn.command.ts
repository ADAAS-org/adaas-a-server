import { A_Feature } from "@adaas/a-concept";
import { A_Command, A_CommandFeatures } from "@adaas/a-utils/a-command";



export class SignInCommand extends A_Command<{ email: string, password: string }, { token: string }> {

    static get entity(): string {
        return 'sign-in';
    }


    @A_Feature.Extend({
        name: A_CommandFeatures.onExecute
    })
    async logSomething() {
        console.log('SignInCommand logSomething called');


        await new Promise(resolve => {
            setTimeout(() => {
                resolve(void 0);
            }, 10000);
        })
    }
}