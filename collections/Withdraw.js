import { Mongo } from 'meteor/mongo';
Withdraw = new Mongo.Collection('withdrawals');

Withdraw.allow({
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
