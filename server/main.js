import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { HTTP } from 'meteor/http';
import { Accounts } from 'meteor/accounts-base'
import { Bert } from 'meteor/themeteorchef:bert';
import { Random } from 'meteor/random';

import Insta from 'instamojo-nodejs';
import moment from 'moment';
import fs from 'fs';

Insta.setKeys(Meteor.settings.instamojo.key, Meteor.settings.instamojo.secret);

Meteor.startup(() => {
    // code to run on server at startup
    process.env.MAIL_URL = "smtp://postmaster%40hitsloop.com:f4b2e02236b5ddff186ef0e6a106ad4d@smtp.mailgun.org:587";
});




Accounts.onCreateUser(function(option, user) {
    // function getRandomInt(min, max) {
    //     return Math.floor(Math.random() * (max - min)) + min;
    // }
    if (option.profile.sponsor) {

        option.profile.minutes = 0;
        option.profile.accountType = "free";
        option.profile.banned = false;
        option.profile.cash = 0;

    } else {
        option.profile.minutes = 0;
        option.profile.accountType = "free";
        option.profile.banned = false;
        option.profile.cash = 0;
    }
    if (option.profile) {
        user.profile = option.profile;
    }

    user.joined_at = new Date();

    return user;
});

Accounts.onLogin(function(info) {

    // console.log(info.user.profile);
    if (info.user.profile.accountType == "premium") {
        var subs = Subscription.find({ user_id: info.user._id, active: true, ended: false }).fetch();
        // console.log(subs);
        // console.log(subs.length);
        _.each(subs, function(value, key) {
            var date = new Date(value.startedAt);

            if (moment(date).diff(moment(), 'days') <= -30) {

                Subscription.update({ _id: value._id }, { $set: { "active": false, "ended": true } });
            }
        });
    }

});

Meteor.methods({
    sendVerificationLink: function() {
        Accounts.emailTemplates.siteName = "HitsLoop";
        Accounts.emailTemplates.from = "HitsLoop <support@hitsloop.com>";

        Accounts.emailTemplates.verifyEmail = {
            subject() {
                return "[HitsLoop] Verify Your Email Address";
            },
            text(user, url) {
                let emailAddress = user.emails[0].address,
                    urlWithoutHash = url.replace('#/', ''),
                    supportEmail = "support@hitsloop.com",
                    emailBody = `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.`;

                return emailBody;
            }
        };
        let userId = Meteor.userId();
        if (userId) {
            return Accounts.sendVerificationEmail(userId);
        }
    },
    checkForVerifiedRef: function() {
        if (Meteor.user().profile.sponsor) {
            Meteor.users.update({ username: Meteor.user().profile.sponsor }, { $inc: { "profile.cash": 0.05 } });

           var addRefPoint = Meteor.users.update({_id: this.userId }, {$set: { "profile.minutes": 50 }});
            if(addRefPoint){
                return true;
            }else{
                throw new Meteor.Error(404, "There's an error when tried to add point to your account");
            }
        }
    },
    addWebsite: (data) => {
        let freeLimit = 3;
        let sites = Website.find({ user_id: Meteor.userId() }).fetch();
        if (Meteor.user().profile.accountType == "free" && sites.length >= 3) {
            throw new Meteor.Error(404, "You used all your free website slots. Please subscribe to premium membership to add more websites");
        } else {
            let result = Website.insert({ user_id: Meteor.userId(), address: data.address, hits: data.hits, totalLimit: data.totalLimit, hourlyLimit: data.hourlyLimit, visitDuration: data.visitDuration, status: data.status, active: data.active });
            if (result) {

                return true;
            } else {
                return false;
            }

        }
    },
    mySites: () => {

        let sites = Website.find({ user_id: Meteor.userId() }).fetch();
        if (!sites)
            throw new Meteor.Error(404, "Error: Not Found", "There is no sites added");
        return sites;
    },
    editSite: (id, action) => {
        let site = Website.find({ user_id: id }).fetch();
        // if(site[0]._id != Meteor.userId()){
        //  throw new Meteor.Error(404, "Sorry, You do not have enough privileges to do it.");
        // }else{

        switch (action) {
            case "play":
                let play = Website.update({ user_id: Meteor.userId(), _id: id, status: { $ne: "remove" } }, { $set: { active: true } });
                if (play) {
                    return true;
                } else {
                    throw new Meteor.Error(404, "Sorry, Your website does not meet our minimim requirements");
                }
                break;
            case "pause":
                let pause = Website.update({ user_id: Meteor.userId(), _id: id }, { $set: { active: false } });
                if (pause) {
                    return true;
                } else {
                    return false;
                }
                break;
            case "delete":
                Website.remove({ _id: id });


                break;
            default:
                break;
        }
        // }
    },
    startExchange: () => {

        let sites = Website.findOne({ user_id: { $ne: Meteor.userId() }, active: true }, { sort: { hits: 1 } });
        if (sites) {
            return sites;
        } else {
            throw new Meteor.Error(404, "Please Add your site in My Websites Section", "Please Add your site in My Websites Section");
        }

    },
    hitted: function(siteId) {

        if (Hit.find({ user_id: Meteor.userId(), hitAt: moment().format('DD MM YYYY') }).fetch().length == 0) {
            Hit.insert({ user_id: Meteor.userId(), hits: [{ website_id: siteId }], hitAt: moment().format('DD MM YYYY') });
        } else if (Hit.find({ user_id: Meteor.userId(), hitAt: moment().format('DD MM YYYY'), website_id: siteId }).fetch().length > 0) {
            throw new Meteor.Error(404, "Sorry, You can't do that", "Sorry, You can't do that");
        } else {
            Hit.update({ user_id: Meteor.userId(), hitAt: moment().format('DD MM YYYY') }, { $addToSet: { hits: { website_id: siteId } } });
        }

        var site = Website.findOne({ _id: siteId });
        if (!site || !Meteor.userId()) {
            throw new Meteor.Error(404, "You can't do that", "Sorry, You can't do that");
        }
        var hit = Website.update({ _id: siteId }, { $inc: { hits: 1 } });

        if (hit) {
            return true;
        } else {
            return false;
        }
    },
    addMinute: function(siteId) {
        if (!Meteor.userId()) {
            throw new Meteor.Error(404, "You can't do that");
        }
        var ownerSite = Website.findOne({ _id: siteId });
        var timeVisited = ownerSite.visitDuration / 60;
        var minute = Meteor.users.update({ _id: Meteor.userId() }, { $inc: { "profile.minutes": timeVisited } });

        var reduceMinute = Meteor.users.update({ _id: ownerSite.user_id }, { $inc: { "profile.minutes": -timeVisited } });
        var siteOwner = Meteor.users.findOne({ _id: ownerSite.user_id });
        if (siteOwner.profile.minutes <= 0) {
            Website.update({ _id: siteId }, { $set: { active: false } });
        }
        if (minute) {
            return true;
        } else {
            return false;
        }
    },
    payForTraffic: function(amount) {


        var data = new Insta.PaymentData();
        data.purpose = "Subscription of amount " + amount; // REQUIRED 
        data.amount = amount; // REQUIRED 
        data.setRedirectUrl(Meteor.settings.public.site + "/purchase/callback");

        var pay = Meteor.wrapAsync(Insta.createPayment, Insta);
        var response = pay(data);

        var payment = Payment.insert({ user_id: this.userId, payment_request_id: response.payment_request.id, amount: response.payment_request.amount, purpose: response.payment_request.purpose, status: response.payment_request.status, created_at: response.payment_request.created_at });

        if (payment) {
            return response;
        } else {
            throw new Meteor.Error(404, "Can't insert your payment details into the DB");
        }
    },
    myrefs: function() {
        var myrefs = Meteor.users.find({ "profile.sponsor": Meteor.user().username }).fetch();
        return myrefs;
    },
    myPayments: function() {
        return Payment.find({ user_id: this.userId }).fetch();
    },
    mySubs: function() {
        var subs = Subscription.find({ user_id: this.userId }).fetch();
        return subs;
    },
    checkPayment: function(paymentRequestId, paymentId) {
        var payment = Meteor.wrapAsync(Insta.getPaymentRequestStatus, Insta);
        var response = payment(paymentRequestId, paymentId);

        if (response.payment_request.status == "Completed") {
            var payment = Payment.update({ payment_request_id: paymentRequestId }, { $set: { status: "Completed" } });
            var minutesToAdd = 0;
            switch (amount) {
                case 9:
                    minutesToAdd = 10000;
                    break;
                case 21:
                    minutesToAdd = 25000;
                    break;
                case 38:
                    minutesToAdd = 50000;
                    break;
                case 69:
                    minutesToAdd = 100000;
                    break;
                case 170:
                    minutesToAdd = 250000;
                    break;
                case 329:
                    minutesToAdd = 500000;
                    break;
                case 625:
                    minutesToAdd = 1000000;
                    break;
                default:
                    minutesToAdd = 0;
                    break;
            }
            Subscription.insert({ user_id: this.userId, type: payment.amount, startedAt: moment(), description: "Premium Features +" + minutesToAdd + " Minutes", endAt: moment().add(30, 'days'), active: true, ended: false });
            Meteor.users.update({ _id: this.userId }, { $set: { "profile.accountType": "premium", "profile.minutes": minutesToAdd } });
            return response.payment_request.status;
        } else {
            throw new Meteor.Error(404, "Can't retrieve payment details", "Can't retrieve payment details");
        }

    },
    isPremium: function() {
        var user = Meteor.users.findOne({ _id: this.userId });
        if (user.profile.accountType == "premium") {
            return true;
        } else {
            return false;
        }
    },
    contactus: function(details) {
        var pastContact = Contact.find({ user_id: this.userId, created_at: moment().format('DD MM YYYY'), status: "open" }).fetch();
        if (pastContact.length == 0) {
            var contact = Contact.insert({ user_id: this.userId, subject: details.sub, message: details.msg, created_at: moment().format('DD MM YYYY'), status: "open" });
            if (!contact) {
                throw new Meteor.Error(404, "Sorry, Please try again later");
            }
            return true;
        } else {
            throw new Meteor.Error(404, "Sorry, You already contacted us today. We will get back to you soon. You can contact us again after that.");
        }
    },
    subOwner: function(userId){
        return Meteor.users.find({_id: userId},{limit:1}).fetch();
    },
    withdraw: function(amount){
        let user = Meteor.users.find({_id: this.userId}, {limit: 1}).fetch()[0];
        if(user.profile.cash >= amount){
            Withdraw.insert({ user_id: this.userId, amount: amount, createdAt: new Date() });
            let deduct = Meteor.users.update({ _id: this.userId }, { $inc: { "profile.cash": -amount}});
            if(deduct){ return "Your withdrawal request is successful. You will receive your payment soon"; }else{throw new Meteor.Error(404, "Something went wrong when trying to request withdrawal"); }
        }else{
           throw new Meteor.Error(404, "You don't have enought balance to withdraw"); 
        }
    },
    createPost: function(html, title){
       let fileName = title + Random.id() + ".html";
       let publicDir = "e:/hitsloop/public/posts/";
       let postId = Post.insert({user_id: this.userId, title: title, file: fileName, createdAt: new Date(), upvotes: 0, downvotes: 0 });
       // try{
       let createPostFile = fs.writeFileSync(publicDir + fileName, html, 'utf8');
   // }catch()
       if(postId){
        return "Your post is successfully posted";
       }else{
        throw new Meteor.Error(404, "Something went wrong posting this");
       }
    }

});
