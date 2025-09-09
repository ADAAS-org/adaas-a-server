import { A_Entity, A_Fragment } from "@adaas/a-concept";
import { User } from "../entities/User.entity";
import { Order } from "../entities/Order.entity";



export class MemoryStore extends A_Fragment {

    entities: Map<string, any> = new Map();


    async save(entity: A_Entity) {
        this.entities.set(entity.aseid.toString(), entity.toJSON());
    }


    async get<T extends any>(aseid: string): Promise<T | undefined> {
        return this.entities.get(aseid);
    }


    async getByType(name: string) {
        return Array.from(this.entities.values())
            .filter(entity => entity.aseid.entity === name);
    }


    async destroy(aseid: string) {
        this.entities.delete(aseid);
    }
}