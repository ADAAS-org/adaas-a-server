import { A_Entity, A_Feature, A_Scope, A_TYPES__EntityBaseMethods } from "@adaas/a-concept";
import { NewUser, UserJSON } from "./User.entity.types";
import { ASEID } from "@adaas/a-utils";
import { UserDoing } from "examples/simple-server/context/UserDoing.context";


export class User extends A_Entity<NewUser, UserJSON> {

    email!: string;
    name!: string;


    // @A_Feature.Define({
    //     name: 'delegateTask'
    // })
    // async delegateTask() {
    //     await this.call('delegateTask');
    // }


    get id(): number {
        return Number(this.aseid.id);
    }


    @A_Feature.Define({
        name: 'do',
        invoke: false
    })
    async do(scope: A_Scope) {
        console.log('Doing something with user:', this.name);
        
        const doingFragment = new UserDoing();

        scope.register(doingFragment);

        return await this.call('do', scope);
    }


    fromNew(newEntity: NewUser): void {
        this.aseid = new ASEID({
            id: newEntity.id,
            namespace: 'users1',
            scope: 'users2',
            entity: 'user3'
        });

        this.email = newEntity.email;
        this.name = newEntity.name
    }



    fromJSON(serialized: UserJSON): void {
        this.aseid = new ASEID(serialized.aseid);
        this.email = serialized.email;
        this.name = serialized.name
    }

    toJSON(): UserJSON {
        return {
            id: this.id,
            aseid: this.aseid.toString(),
            email: this.email,
            name: this.name
        };
    }
}