import * as _ from 'lodash';

class Database {
    public users = [];
    public groups = {
        1: [],
        2: [],
        3: []
    };

    constructor() {
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
        if(!this.groups[groupNumber]){
            return;
        }
        this.addUserGroup(userId);
        this.groups[groupNumber].push(userId);
        console.log(this.groups);
    };
}

export const base = new Database();
