import { Mongo } from 'meteor/mongo';

Hit = new Mongo.Collection('hits');

Hit.allow({
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
