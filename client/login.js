import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var'
import './main.html';




Template.login.onCreated(function(){
this.loginErrors = new ReactiveVar([]);
});


Template.login.events({
    'submit form': (e,t) => {
        e.preventDefault();

        if ($('#loginId').val() == "" || $('#loginPassword').val() == "") {
            console.log("Please enter a username and password");
            t.loginErrors.set(["Please enter a username and password"]);
        } else {
            Meteor.loginWithPassword(event.target.loginId.value, event.target.loginPassword.value, function(error) {
                console.log(error);
                if (!error) {
                    sAlert.info("Logged in");
                    FlowRouter.go('home');
                } else {
                    console.log(error);
                    // if(error.reason == "Match failed"){

                    t.loginErrors.set(["Please enter a valid username and password."]);
                    // }
                }
            });
        }
    }
});


Template.login.helpers({
    loginErrors: function() {
        // if (Template.instance().loginErrors.get() != "") {
            return Template.instance().loginErrors.get();
        // } else {
            // return null;
        // }
    }
});
