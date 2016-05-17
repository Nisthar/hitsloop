import { Mongo } from 'meteor/mongo';
Payment = new Mongo.Collection('payments');
Payment.allow({
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
