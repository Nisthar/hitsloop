import { Mongo } from 'meteor/mongo';

Subscription = new Mongo.Collection('subscriptions');

Subscription.allow({
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
