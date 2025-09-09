import { A_Component, A_Feature, A_Inject } from "@adaas/a-concept";
import { UserDoing } from "../context/UserDoing.context";


export class UserDoingComponent extends A_Component {


    @A_Feature.Extend({
        name: 'do'
    })
    doJob(
        @A_Inject(UserDoing) userDoing: UserDoing
    ): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Doing job...');
                userDoing.setOperation('job');
                resolve();
            }, 1000);
        });
    }


    @A_Feature.Extend({
        name: 'do'
    })
    doTask(
        @A_Inject(UserDoing) userDoing: UserDoing
    ): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Doing task...');
                userDoing.setOperation('task');
                resolve();
            }, 1000);
        });
    }

}
