const _ = require('lodash');

function Database() {
    this.users = [];
    this.messages = [];

    this.groups = {
        1: [],
        2: [],
        3: [],
    }

    this.addUser = (user)=>{
        this.users.push(user);
        this.users = _.uniqBy(this.users, 'id');
    }

    this.addUserGroup = (userId, groupNumber) =>{
        // console.log(userId, groupNumber);
        if(!groupNumber) {
            this.groups.forEach(g=>{
                _.remove(g, userId);
            })
            return;
        }
        this.groups[groupNumber].push(userId);
        console.log(this.groups);
    }
    // this.addPendingQuestion()

}

module.exports = new Database();