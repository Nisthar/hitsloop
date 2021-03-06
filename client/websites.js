import {
    Template
}
from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
// import { Session } from 'meteor/session';
// import {FlowRouter} from 'meteor/kadira:flow-router';
import './main.html';

Template.websites.onCreated(function(){
  document.title = "My Websites";
});

Template.websites.helpers({
  mySites: function(){
    return Website.find({user_id: Meteor.userId()}).fetch();
    // return Meteor.call('mySites');
  },
  isPaused: function (status,review) {
    if(review == "reviewing"){
      return "Reviewing";
    }else if(review == "remove"){
      return "Disqualified";
    }
    if(status == "0"){
      return "pause";
    }else{
      return "play";
    }
  },
  isPausedNot: (status) => {
      if(status == "1"){
        return "pause";
      }else{
        return "play";
      }
  },
  totalLimit: function(limit){
    if(limit == "unlimit"){
      return limit + "ed";
    }else{
      return "%";
    }
  }
});

Template.websites.events({
  'click .pauseplay': function (e,t) {
     let id = e.target.parentElement.getAttribute('data-id');
     let action = e.target.parentElement.getAttribute('data-action');
    console.log(e.target.parentElement.getAttribute('data-id'));
    Meteor.call("editSite", id, action,function(err,result){
          if(err){
            throw new Meteor.Error(404,err.reason);
          }
          console.log(result)
        });
  },

});
