import * as _ from 'lodash';
import {IUser} from '../bot/entities';
import {DESCRIPRIONS, GROUP, NOBODY, NOT_GREETED} from '../bot/groups/entities';

class UsersList {
    private users: {[key: string]: IUser} = {};
    private firebase: any;

    constructor() {}

    init(firebase) {
        this.firebase = firebase;
        this.firebase.users$.subscribe(u => {
            this.users = u;
        });
    }

    getUsers(groupID = null) {
        if (groupID === NOBODY) {
            return this.getUsersWithoutGroup();
        }

        if (groupID === NOT_GREETED) {
            return this.getNotGreeted();
        }

        var allUsers = Object.values(this.users);
        if (!groupID || !DESCRIPRIONS[groupID]) {
            return allUsers;
        }
        return allUsers.filter(({group}) => group === groupID);
    }

    getUsersWithoutGroup() {
        return Object.values(this.users).filter(({group}) => !group);
    }

    get getGroupsButtons(): {text: string; callback_data: string}[][] {
        return Object.keys(GROUP).map(key => [
            {
                text: DESCRIPRIONS[key],
                callback_data: key
            }
        ]);
    }

    addUser(user: IUser) {
        const alreadyHas = !!this.users[user.id];

        if (alreadyHas) {
            return;
        }

        this.users[user.id] = user;
        this.firebase.addUser(user);
    }

    getUserGroup(userId: number): string {
        return this.users[userId].group;
    }

    setName(userId, name: string) {
        var ourUser = this.users[userId];
        if (!ourUser) {
            return;
        }
        ourUser.real_name = name;
        this.firebase.addUser(ourUser);
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
        this.firebase.addUser(ourUser);
    }

    formGroupsList(): string {
        var groups = _.groupBy(this.users, 'group');
        var listString = Object.keys(groups)
            .map(key => {
                return (
                    `${DESCRIPRIONS[key] || 'Без группы'} \n` +
                    groups[key].map((u: IUser) => `${this.getUserMention(u)}  ${u.real_name}`).join('\n')
                );
            })
            .join('\n\n');

        return listString;
    }

    getNotGreeted() {
        var users = Object.values(this.users).filter(({greeted}) => !greeted);
        users.forEach(u => {
            u.greeted = true;
            this.firebase.addUser(u);
        });
        return users;
    }

    private getUserMention(user: IUser): string {
        if (user.username) {
            return `[@${user.username}](tg://user?id=${user.id})`;
        }
        return `[${[user.first_name, user.last_name].filter(t => !!t).join(' ')}](tg://user?id=${user.id})`;
    }
}

export const usersList = new UsersList();
