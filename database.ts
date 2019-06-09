import * as _ from 'lodash';

class Database {
    users = [];
    groups = {
        1: [],
        2: [],
        3: []
    };

    groupsDescription = {
        1: 'Друзы(1)',
        2: 'Датишные(2)',
        3: 'Кибуц(3)'
    }

    constructor() {
    }


    get getGroupsButtons() {
        return Object.keys(this.groupsDescription).map(key => ([{
            text: this.groupsDescription[key],
            callback_data: key
        }]))
    }

    addUser(user) {
        this.users.push(user);
        this.users = _.uniqBy(this.users, 'id');

    };

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
    };
}

export const base = new Database();
