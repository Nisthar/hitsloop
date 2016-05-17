import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import './main.html';

Template.register.rendered = function() {
    Session.set('registerErrors', null);
    document.title = "HitsLoop | Register";
}
Template.register.events({
    'submit form': function(event) {
        event.preventDefault();
        console.log("Registering new user....");

        var userDetails = {
            username: event.target.registerUsername.value,
            password: event.target.registerPassword.value,
            email: event.target.registerEmail.value,

            profile: {}
        };
        if (Session.get('ref') || Session.get('ref') != "") {
            var ref = Session.get('ref');
            delete Session.get('ref');
            userDetails.profile.sponsor = ref;
        }
        // userDetails.joined_at = new Date();
        var registerErrors = [];
        // let regContext = Meteor.users.simpleSchema().namedContext();
        // regContext.addInvalidKeys({ name: "username", type: "required", value: "Please enter your username"});
        // if (!regContext.validate(userDetails, { modifier: false })) {
        // let fields = regContext.invalidKeys();
        // for (let i in fields) {
        // registerErrors.push(regContext.keyErrorMessage(fields[i].name));
        // }

        // } else {

        Accounts.createUser(userDetails, function(error) {
            if (error) {
                registerErrors.push(error.reason);
                Session.set('registerErrors', registerErrors);
            } else {
                Meteor.call('sendVerificationLink', (error, response) => {
                    if (error) {
                        Bert.alert(error.reason, 'danger');
                    } else {
                        Bert.alert('Please verify your email!', 'success');
                        FlowRouter.go('home');
                    }
                });
                
              
            }
        });
    }
});


Template.register.helpers({
    errors: function() {
        if (Session.get('registerErrors')) {
            let registerErrors = Session.get('registerErrors');
            delete Session.get('registerErrors');
            return registerErrors;
        } else {
            return false;
        }
    }
});
