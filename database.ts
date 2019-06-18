import * as _ from 'lodash';
import {firebase} from './firebase';

export const ALL = 'all';
export interface IUser {
    id: number
}
class Database {
    users:IUser[] = [];
    groups = {
        druzim: [0],
        datim: [0],
        kibuz: [0]
    };

    groupsDescription = {
        druzim: 'Друзы(1)',
        datim: 'Датишные(2)',
        kibuz: 'Кибуц(3)'
    }

    constructor() {
        firebase.readUsers().then((u) => {
            const needToUpdate = this.users.length;
            this.users = this.users.concat(u);

            if (needToUpdate) {
                firebase.saveUsers(this.users);
            }
        });

        firebase.readGroups().then((g) => {
            if (!g) {
                return
            }
            this.groups = g
        });

    }


    get getGroupsButtons() {
        return Object.keys(this.groupsDescription).map(key => ([{
            text: this.groupsDescription[key],
            callback_data: key
        }]))
    }

    addUser(user) {
        const alreadyHas = !!this.users.find((u) => {
            return u.id === user.id
        });

        if (alreadyHas) {
            return;
        }

        this.users.push(user);
        this.users = _.uniqBy(this.users, 'id');
        firebase.saveUsers(this.users);
    };

    getUserGroup(userId: number): string {
        return Object.keys(this.groups).find((key) => {
            var res = this.groups[key].find((id) => id === userId)
            return res
        })
    }

    addUserGroup(userId, groupNumber = null) {
        if (!groupNumber) {
            _.forEach(this.groups, value => {
                _.pull(value, userId);
            });
            return;
        }

        if (!this.groups[groupNumber]) {
            return;
        }

        this.addUserGroup(userId);
        this.groups[groupNumber].push(userId);
        console.log(this.groups);
        firebase.saveGroups(this.groups);
    };
}

export const base = new Database();
