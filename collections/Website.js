import { Mongo } from 'meteor/mongo';
Website = new Mongo.Collection('websites');
Website.allow({
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
