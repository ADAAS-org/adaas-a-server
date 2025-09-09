import { A_Fragment } from "@adaas/a-concept";


export class UserDoing extends A_Fragment {


    protected operation!: string;


    setOperation(operation: string) {
        this.operation = operation;
    }

    toJSON() {
        return {
            name: this.name,
            did: this.operation
        };
    }

}