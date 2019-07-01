import {firebase} from './firebase';

export const ALL = 'all';
export const NOBODY = 'nobody';

export interface IUser {
    id: number;
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


    forwarded = []

    constructor() {
        firebase.readUsers().then((u) => {
            this.users = u;
        });
    }

    getUsers(groupID = null) {
        if(groupID === NOBODY){
            return this.getUsersWithoutGroup()
        }
        var allUsers = Object.values(this.users);
        if (!groupID || !DESCRIPRIONS[groupID]) {
            return allUsers
        }
        return allUsers.filter(({group}) => group === groupID)
    }

    getUsersWithoutGroup(){
        return Object.values(this.users).filter(({group}) => !group)
    }

    get getGroupsButtons() {
        return Object.keys(GROUP).map(key => ([{
            text: DESCRIPRIONS[key],
            callback_data: key
        }]))
    }

    addForwardedMessage(msg) {
        this.forwarded.push(msg);
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

    setName(userId, name: string){
        var ourUser = this.users[userId];
        if(!ourUser){
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
}

export const base = new Database();
