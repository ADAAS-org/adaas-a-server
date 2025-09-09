import { A_Route } from "@adaas/a-server/entities/A-Route/A-Route.entity"


export type A_SERVER_TYPES__ServerConstructor = {
    name: string,
    version: string,
    routes: A_Route[],
    port: number,
}