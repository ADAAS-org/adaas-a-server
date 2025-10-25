import { A_TYPES__Entity_Serialized } from "@adaas/a-concept"


export type NewUser = {
    id: number
    email: string
    name: string
}


export type UserJSON = NewUser & A_TYPES__Entity_Serialized