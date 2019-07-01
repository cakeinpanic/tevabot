import {firebase} from './firebase';

export const ALL = 'all';

export interface IUser {
    id: number;
    group?: string;
    real_name?: string;
}

class Database {
    private users: {[key: string]: IUser} = {};

    groupsDescription = {
        druzim: 'Друзы(1)',
        datim: 'Датишные(2)',
        kibuz: 'Кибуц(3)'
    }

    forwarded = []

    constructor() {
        firebase.readUsers().then((u) => {
            this.users = u;
        });
    }


    getUsers(groupID = null) {
        var allUsers = Object.values(this.users);
        if (!groupID || !this.groupsDescription[groupID]) {
            return allUsers
        }
        return allUsers.filter(({group}) => group === groupID)
    }

    get getGroupsButtons() {
        return Object.keys(this.groupsDescription).map(key => ([{
            text: this.groupsDescription[key],
            callback_data: key
        }]))
    }

    addForwardedMessage(msg) {
        this.forwarded.push(msg);
    }

    addUser(user: IUser) {
        const alreadyHas = !!this.users[user.id];
        console.log(this.users);
        console.log(alreadyHas);
        if (alreadyHas) {
            return;
        }

        this.users[user.id] = user;
        firebase.addUser(user);
    };

    getUserGroup(userId: number): string {
        return this.users[userId].group;
    }

    addUserGroup(userId, groupNumber = null) {
        var ourUser = this.users[userId];
        console.log(this.users, ourUser);
        if (!groupNumber) {
            ourUser.group = null;
        }

        if (!this.groupsDescription[groupNumber]) {
            return;
        }

        ourUser.group = groupNumber;
        firebase.addUser(ourUser);
    };
}

export const base = new Database();
