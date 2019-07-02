import * as _ from 'lodash';
import {firebase} from './firebase';

export const ALL = 'all';
export const NOBODY = 'nobody';

export interface IUser {
    id: number;
    username: string;
    name: string;
    group?: string;
    real_name?: string;
}

export enum GROUP {
    ahmedit = 'ahmedit',
    city = 'city',
    kibuz = 'kibuz',
    druzim = 'druzim',
}

export const DESCRIPRIONS = {
    [GROUP.ahmedit]: 'Ахмедиты(1)',
    [GROUP.city]: 'Городская община(2)',
    [GROUP.kibuz]: 'Кибуц(3)',
    [GROUP.druzim]: 'Друзы(4)'
}

class Database {
    private users: {[key: string]: IUser} = {};

    constructor() {
        firebase.users$.subscribe((u) => {
            this.users = u;
        });
    }

    getUsers(groupID = null) {
        if (groupID === NOBODY) {
            return this.getUsersWithoutGroup()
        }
        var allUsers = Object.values(this.users);
        if (!groupID || !DESCRIPRIONS[groupID]) {
            return allUsers
        }
        return allUsers.filter(({group}) => group === groupID)
    }

    getUsersWithoutGroup() {
        return Object.values(this.users).filter(({group}) => !group)
    }

    get getGroupsButtons(): {text: string, callback_data: string}[][] {
        return Object.keys(GROUP).map(key => ([{
            text: DESCRIPRIONS[key],
            callback_data: key
        }]))
    }


    addUser(user: IUser) {
        const alreadyHas = !!this.users[user.id];

        if (alreadyHas) {
            return;
        }

        this.users[user.id] = user;
        firebase.addUser(user);
    };

    getUserGroup(userId: number): string {
        return this.users[userId].group;
    }

    setName(userId, name: string) {
        var ourUser = this.users[userId];
        if (!ourUser) {
            return
        }
        ourUser.real_name = name;
        firebase.addUser(ourUser);
    }

    addUserGroup(userId, groupNumber = null) {
        var ourUser = this.users[userId];
        if (!groupNumber) {
            ourUser.group = null;
        }

        if (!DESCRIPRIONS[groupNumber]) {
            return;
        }

        ourUser.group = groupNumber;
        firebase.addUser(ourUser);
    };

    formGroupsList(): string {
        var groups = _.groupBy(this.users, 'group');
        var k = Object.keys(groups).map((key) => {
            return (DESCRIPRIONS[key] || 'Без группы') + '\n' + groups[key].map((u: IUser) => `@${u.username || u.name}  ${u.real_name}`).join('\n');
        }).join('\n\n')

        return k
    }
}

export const base = new Database();
