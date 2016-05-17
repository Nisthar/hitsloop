import { Meteor } from 'meteor/meteor';

Meteor.users.allow({
    insert: function(){
      return false;
    },
    update: function(){
        return false;
    },
    remove: function(){
      return false;
    }
});
