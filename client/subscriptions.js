import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

Meteor.subscribe('mypayments');
Meteor.subscribe('mywebsites');
Meteor.subscribe('hits');
Meteor.subscribe('mysubs');
Meteor.subscribe('recentPurchases');
Meteor.subscribe('posts');
