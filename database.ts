import * as _ from 'lodash';
import {firebase} from './firebase';

export const ALL = 'all';

class Database {
    users = [];
    groups = {
        druzim: [],
        datim: [],
        kibuz: []
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

    getUserGroup(userId:number): string {
        return Object.keys(this.groups).find((key) => {
            console.log(this.groups[key]);
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
    };
}

export const base = new Database();
