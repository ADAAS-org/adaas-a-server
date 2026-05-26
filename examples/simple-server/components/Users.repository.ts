import { A_Component, A_Entity, A_Feature, A_Inject, A_Scope, A_TYPES__EntityFeatures, } from "@adaas/a-concept";
import { User } from "../entities/User/User.entity";
import { UserJSON } from "../entities/User/User.entity.types";
import { SignInCommand } from "../commands/SignIn.command";
import { A_Command } from "@adaas/a-utils/a-command";
import { A_Logger } from "@adaas/a-utils/a-logger";
import { A_ServerEntityList } from "@adaas/a-server/entity-list/A-EntityList.entity";
import { A_ServerListQueryFilter } from "@adaas/a-server/list-query/A-ServerListQueryFilter.context";


export class UsersRepository extends A_Component {

    private mockedUsers: UserJSON[] = [
        new User({
            id: 1,
            name: 'John Doe',
            email: 'joe@doe.com'
        }).toJSON(),
        new User({
            id: 2,
            name: 'mr Smith',
            email: 'mr.smith@doe.com'
        }).toJSON(),
    ];


    @A_Feature.Extend({
        name: A_TYPES__EntityFeatures.LOAD,
        scope: {
            exclude: [A_ServerEntityList, A_Command, SignInCommand]
        }
    })
    load(
        @A_Inject(User) user: User,
        @A_Inject(A_Scope) scope: A_Scope
    ) {

        console.log('Loading user with ASEID:', user.aseid);

        const existedUser = this.mockedUsers.find((u) => u.id === user.id);

        if (!existedUser) {
            throw new Error('User not found');
        }

        user.fromJSON(existedUser);

    }


    @A_Feature.Extend({
        name: A_TYPES__EntityFeatures.LOAD,
        scope: [A_ServerEntityList]
    })
    list(
        @A_Inject(A_ServerListQueryFilter<['page', 'itemsPerPage']>) query: A_ServerListQueryFilter<['page', 'itemsPerPage']>,
        @A_Inject(A_Logger) logger: A_Logger,
        @A_Inject(A_ServerEntityList<User>) list: A_ServerEntityList<User>
    ) {
        console.log('Listing users with query:', query);
        console.log('Listing users with query:', list);

        const page = parseInt(query.get('page', '1'), 10);
        const itemsPerPage = parseInt(query.get('itemsPerPage', '10'), 10);


        const items = this.mockedUsers.slice((page - 1) * itemsPerPage, page * itemsPerPage);


        list.fromList(
            items,
            {
                total: this.mockedUsers.length,
                page: page,
                pageSize: itemsPerPage
            }
        )
    }




    @A_Feature.Extend({
        name: 'save'
    })
    create(
        @A_Inject(User) user: User
    ) {
        this.mockedUsers.push(user.toJSON());
    }



    // @A_Feature.Extend({
    //     name: 'destroy'
    // })
    // delete(
    //     @A_Inject(User) user: User
    // ) {
    //     const existedUser = this.mockedUsers.find((u) => u.id === user.id);

    //     if (!existedUser) {
    //         throw new Error('User not found');
    //     }

    //     this.mockedUsers = this.mockedUsers.filter((u) => u.id !== user.id);
    // }

}