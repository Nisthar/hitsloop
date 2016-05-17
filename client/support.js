import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import alertify from 'alertifyjs';

Template.support.onCreated(function(){
  document.title = "HitsLoop | Support";
});

Template.support.events({
  'click #contactusbtn': function (e,t) {
    if($('#subjectInput').val() != "" || $('#messageInput').val() != "" || $('#subjectInput').val() == undefined || $('#messageInput').val() == undefined){
    var contactData = {
      sub: $('#subjectInput').val(),
      msg: $('#messageInput').val()
    }
    console.log(contactData);

    Meteor.call('contactus', contactData,function(err,res){
      if(err){
alertify.error(err.reason);
      }
      alertify.success('Success, We will be replying to you soon through your email');
    })
  }else{
  alertify.error("Please enter all required details");
}
}
});
