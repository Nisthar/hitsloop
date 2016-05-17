// Meteor.publish('users')
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';


Meteor.publish('mypayments', function(){
   return Payment.find({ user_id: this.userId });
});
Meteor.publish('mywebsites', function(){
    return Website.find({ user_id: this.userId}); 
});
Meteor.publish('hits', function(){
   return Hit.find(); 
});
Meteor.publish('mysubs', function(){
   return Subscription.find({ user_id: this.userId }); 
});
Meteor.publish('recentPurchases',function(){
  return Subscription.find({},{sort: { createdAt: -1}});
});
Meteor.publish('posts',function(){
  return Post.find({},{limit: 5});
});
