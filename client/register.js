import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import './main.html';

Template.register.rendered = function () {
    Session.set('registerErrors', null);
}
Template.register.events({
    'submit form': function (event) {
        event.preventDefault();
        console.log("Registering new user....");
        let userDetails = {
            username: event.target.registerUsername.value,
            password: event.target.registerPassword.value,
            email: event.target.registerEmail.value,

            profile: {
                accountType: "free",
                minutes: 10,
            }
        };
        let registerErrors = [];
        // let regContext = Meteor.users.simpleSchema().namedContext();
        // regContext.addInvalidKeys({ name: "username", type: "required", value: "Please enter your username"});
        // if (!regContext.validate(userDetails, { modifier: false })) {
        // let fields = regContext.invalidKeys();
        // for (let i in fields) {
        // registerErrors.push(regContext.keyErrorMessage(fields[i].name));
        // }

        // } else {

        Accounts.createUser(userDetails, function (error) {
            if (error) {
                registerErrors.push(error.reason);
                Session.set('registerErrors', registerErrors);
            } else {
                sAlert.warning('Registered Successfully');
                FlowRouter.go('home');
            }
        });
    }
});


Template.register.helpers({
    errors: function () {
        if (Session.get('registerErrors')) {
            let registerErrors = Session.get('registerErrors');
            delete Session.get('registerErrors');
            return registerErrors;
        } else {
            return false;
        }
    }
});
