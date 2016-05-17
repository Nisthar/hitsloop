import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import alertify from 'alertifyjs';
import './main.html';




Template.login.onCreated(function() {
    document.title = "HitsLoop | Login";
    this.loginErrors = new ReactiveVar([]);
});


Template.login.events({
    'submit form': (e, t) => {
        e.preventDefault();

        if ($('#loginId').val() == "" || $('#loginPassword').val() == "") {

            t.loginErrors.set(["Please enter a username and password"]);
        } else {
            Meteor.loginWithPassword(event.target.loginId.value, event.target.loginPassword.value, function(error) {

                if (!error) {
                    if (Meteor.user().profile.banned) {
                        alertify.alert("Error", "You are banned for violating terms and conditions");
                        Meteor.logout();
                        window.location.href = Meteor.settings.public.site;
                    }
                    alertify.success("Successfully Logged in");
                    window.location.href = Meteor.settings.public.site + "/account";
                } else {

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
