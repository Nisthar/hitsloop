import {
    Template
}
from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { $ } from 'meteor/jquery';
import {FlowRouter} from 'meteor/kadira:flow-router';
import alertify from 'alertifyjs';
import './add_website.html';

Template.add_website.onRendered(() => {
    Session.set('addErrors', []);
    document.title = "Add Websites";
});
Template.add_website.rendered = function () {

    // let mintuesSlider = document.getElementById("minutes-slider");
    this.$("#minutes-slider").noUiSlider({
        start: [5],
        connect: "lower",
        range: {
            'min': [5],
            'max': [60]
        }
    }).on('change', function (ev, val) {

        $('#minutes-slider-value').text(Math.round(val));
        let hitsForMins = val / 60 * Meteor.user().profile.minutes;

        $('#hitmins').text(Math.round(hitsForMins));

    });
    this.$('#hourly-limit').noUiSlider({
        start: [5],
        connect: "lower",
        range: {
            min: 5,
            max: 60
        }
    }).on('change', (ev, val) => {
        $('#hourly-limit-display').text(Math.round(val));
    });
};

Template.add_website.events({
    'click #limithits': function (e, t) {
        $('#totalLimitInput').removeClass('disabled');

    },
    'click #unlimitedhits': function (e, t) {
        $('#totalLimitInput').addClass('disabled');
    },
    'click #submit': (event, template) => {

        
        let requiredFields = ['webUrl', 'hitmins'];
        let errorMessages = ['Please Enter a Valid Url', 'Please choose the visit duration for your site'];
        let errors = [];
        _.each(requiredFields, function (value, key) {


            if ($("#" + value).prop('nodeName') == "INPUT") {
                if ($("#" + value).val() == "") {
                    errors.push(errorMessages[key]);
                }
            } else if ($("#" + value).prop('nodeName') == "DIV") {
                if ($("#" + value).text() == "") {
                    errors.push(errorMessages[key]);
                }
            }


        });
        if (errors.length > 0) {
           
          alertify.error("Please check you entered all the fields");

        
            Session.set('addErrors', errors);
        } else {
            let formData = {
                address: $('#webUrl').val(),
                hits: 0,
                totalLimit: $('input[name="totalLimit"]').val(),
                hourlyLimit: $('#hourly-limit-display').text(),

                visitDuration: $('#minutes-slider-value').text(),
                status: "reviewing",
                active: false

            };
            Meteor.call('addWebsite', formData, function (err, result) {
                if (err) {
                    alertify.alert("Error",err.reason);
                }
                FlowRouter.go('/websites');
            });
        }
    },
    'click #cancel': function(){
        alertify.confirm("Confirm","Are you sure?", function(){ alertify.success("Redirecting to your Account"); setTimeout(function(){ FlowRouter.go('/account'); }, 3000); }, function(){ alertify.closeAll(); });
    },
    'click #customtesource': function(){
        Meteor.call('isPremium', function(err,res){
            if(err){
                alertify.alert("Error", err.reason);
            }
            if(res){
                alertify.warning("Please choose your custom url");
            }else{
                alertify.error("Sorry, you need to upgrade your account to use this feature");
                $('#directtesource').click();
            }
        });
    }
});

Template.add_website.helpers({
    errors: () => {
        return Session.get('addErrors');
    }

});
