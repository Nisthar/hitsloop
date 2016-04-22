import {
    Template
}
from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { $ } from 'meteor/jquery';
import {FlowRouter} from 'meteor/kadira:flow-router';
import './add_website.html';

Template.add_website.onRendered(() => {
    Session.set('addErrors', []);
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
        console.log(val);
        $('#minutes-slider-value').text(Math.round(val));
        let hitsForMins = val / 60 * Meteor.user().profile.minutes;
        console.log(Math.round(hitsForMins));
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
        console.log("clicked submit");
        let requiredFields = ['webUrl', 'hitmins'];
        let errorMessages = ['Please Enter a Valid Url', 'Please choose the visit duration for your site'];
        let errors = [];
        _.each(requiredFields, function (value, key) {
            console.log($("#" + value).prop('nodeName'));
            console.log($("#" + value).val());
            if ($("#" + value).prop('nodeName') == "INPUT") {
                if ($("#" + value).val() == "") {
                    errors.push(errorMessages[key]);
                }
            } else if ($("#" + value).prop('nodeName') == "DIV") {
                if ($("#" + value).text() == "") {
                    errors.push(errorMessages[key]);
                }
            }
            console.log(errorMessages[key]);

        });
        if (errors.length > 0) {
            console.log(errors);
            Session.set('addErrors', errors);
        } else {
            let formData = {
                address: $('#webUrl').val(),
                hits: 0,
                totalLimit: $('input[name="totalLimit"]').val(),
                hourlyLimit: $('#hourly-limit-display').text(),

                visitDuration: $('#minutes-slider-value').text(),
                status: "reviewing",
                active: true

            };
            Meteor.call('addWebsite', formData, function (err, result) {
                if (err) {
                    console.log(err);
                }
                FlowRouter.go('/websites');
            });
        }
    }
});

Template.add_website.helpers({
    errors: () => {
        return Session.get('addErrors');
    }

});
