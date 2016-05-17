// import moment from 'momentjs/moment';
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { $ } from 'meteor/jquery';
import Sharer from 'sharer.npm.js';

Template.referrals.onCreated(function() {
    var self = this;
    document.title = "Referrals";
    this.referrals = new ReactiveVar([]);
    Meteor.call('myrefs', function(err, res) {
        if (err) {
            throw new Meteor.Error(404, err.reason);
        }

        if (res) {
            self.referrals.set(res);
        } else {
            self.referrals.set([]);
        }
    });

});

Template.referrals.events({
    'click .sharer': function(e, t) {
        const sharer = new Sharer(e.target)
        sharer.share();
    }
});

Template.referrals.helpers({
    referrals: function() {
        return Template.instance().referrals.get();
    },
    myRefLink: function() {
        return Meteor.settings.public.site + "/ref/" + Meteor.user().username + "";
    },
    totalRefs: function() {
        return Template.instance().referrals.get().length;
    },
    totalCash: function() {
        let cash = Meteor.user().profile.cash;
        if (cash == undefined) {
            return 0;
        } else {
            return Meteor.user().profile.cash;

        }
    }


});
//cashoutBtn
Template.referrals.events({
    'click #withdrawModalBtn': function(e) {
        $('#withdrawModalBtn').hide();
        $('#cashoutForm').show('slow');
    },
    'click #cashoutBtn': function(e) {
        let amount = $('#withdrawAmount').val();
        if (amount <= 20) {
            Bert.alert('You need $20 or more to request a withdraw');
        } else {
            Meteor.call('withdraw', amount, function(err, res) {
                if (err) {
                    Bert.alert(err.reason, 'error');
                }
                Bert.alert(res, 'success');
            });
        }

    }
});
