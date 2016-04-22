import { Template } from 'meteor/templating';
import './main.html';

Template.account.helpers({
    isEqual: function(a,b){
        return a === b;
    }
});
