import { A_Component, A_Entity, A_Feature, A_Inject,  A_Scope,  } from "@adaas/a-concept";
import { User } from "../entities/User/User.entity";
import { UserJSON } from "../entities/User/User.entity.types";
import { A_EntityList } from "@adaas/a-server/entities/A_EntityList/A_EntityList.entity";
import { A_ListQueryFilter } from "@adaas/a-server/context/A-ListQueryFilter/A_ListQueryFilter.context";
import { A_Command, A_Logger } from "@adaas/a-utils";
import { A_TYPES__EntityFeatures } from "@adaas/a-concept/dist/src/global/A-Entity/A-Entity.constants";
import { SignInCommand } from "../commands/SignIn.command";


export class UsersRepository extends A_Component {

    private mockedUsers: UserJSON[] = [
        new User({
            id: 1,
            name: 'John Doe',
            email: 'joe@doe.com'
        }).toJSON(),
        new User({
            id: 2,
            name: 'John Doe',
            email: 'joe@doe.com'
        }).toJSON(),
    ];


    @A_Feature.Extend({
        name: 'load',
        scope: {
            exclude: [A_EntityList, A_Command, SignInCommand]
        }
    })
    load(
        @A_Inject(User) user: User,
        @A_Inject(A_Scope) scope: A_Scope
    ) {

        const existedUser = this.mockedUsers.find((u) => u.id === user.id);

        if (!existedUser) {
            throw new Error('User not found');
        }

        user.fromJSON(existedUser);

    }


    @A_Feature.Extend({
        name: A_TYPES__EntityFeatures.LOAD,
        scope: [A_EntityList]
    })
    list(
        @A_Inject(A_ListQueryFilter) query: A_ListQueryFilter<['page', 'itemsPerPage']>,
        @A_Inject(A_Logger) logger: A_Logger,
        @A_Inject(A_EntityList<User>) list: A_EntityList<User>
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
        name: A_TYPES__EntityFeatures.SAVE
    })
    create(
        @A_Inject(User) user: User
    ) {
        this.mockedUsers.push(user.toJSON());
    }



    @A_Feature.Extend({
        name: A_TYPES__EntityFeatures.DESTROY
    })
    delete(
        @A_Inject(User) user: User
    ) {
        const existedUser = this.mockedUsers.find((u) => u.id === user.id);

        if (!existedUser) {
            throw new Error('User not found');
        }

        this.mockedUsers = this.mockedUsers.filter((u) => u.id !== user.id);
    }

}