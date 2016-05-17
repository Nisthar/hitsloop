import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';
FlowRouter.route('/', {
    name: 'home',
    triggersEnter: [function(context, redirect) {
        if (Meteor.userId()) { redirect('/account'); } }],
    action: function(params) {
        BlazeLayout.render("main", { header: "navbar", content: "home" });
    }
});
FlowRouter.route('/register', {
    name: 'register',
    action: function(params) {
        BlazeLayout.render("main", { header: "navbar", content: "register" });
    }
});
FlowRouter.route('/login', {
    name: 'login',
    action: function(params) {
        BlazeLayout.render("main", { header: "navbar", content: "login" });
    }
});

FlowRouter.route('/verify-email/:token', {
    name: 'verify-email',
    action(params) {
        Accounts.verifyEmail(params.token, (error) => {
            if (error) {
                Bert.alert(error.reason, 'danger');
            } else {
                Meteor.call('checkForVerifiedRef', function(err, res) {
                    if (err) {
                        Bert.alert(error.reason, 'danger');
                    } else {
                        FlowRouter.go('/');
                        Bert.alert('Email verified Successfully', 'success');
                    }
                });

            }
        });
    }
});

function addActiveClass() {
    let selector = '.' + FlowRouter.current().path.substr(1) + '';

    $('li.active').removeClass('active');
    $(selector).addClass('active');
}

function isAuthenticated(context, redirect) {
    if (!Meteor.userId()) {
        redirect('/login');
    }
}

FlowRouter.route('/account', {
    triggersEnter: [addActiveClass, isAuthenticated],
    action: function(params) {
        BlazeLayout.render("main", { header: "navbar", content: "account" });
    }
});
FlowRouter.route('/websites', {
    triggersEnter: [addActiveClass, isAuthenticated],
    action: function(params) {
        BlazeLayout.render("main", { header: "navbar", content: "websites" });
    }
});
FlowRouter.route('/exchange', {
    triggersEnter: [addActiveClass, isAuthenticated],
    action: function(params) {
        BlazeLayout.render("main", { header: "navbar", content: "exchange" });
    }
});
FlowRouter.route('/buy', {
    triggersEnter: [addActiveClass, isAuthenticated],
    action: function(params) {
        BlazeLayout.render("main", { header: "navbar", content: "buy" });
    }
});
FlowRouter.route('/referrals', {
    triggersEnter: [addActiveClass, isAuthenticated],
    action: function(params) {
        BlazeLayout.render("main", { header: "navbar", content: "referrals" });
    }
});
FlowRouter.route('/support', {
    triggersEnter: [addActiveClass, isAuthenticated],
    action: function(params) {
        BlazeLayout.render("main", { header: "navbar", content: "support" });
    }
});


FlowRouter.route('/websites/new', {
    triggersEnter: [isAuthenticated],
    action: function(params) {
        BlazeLayout.render("main", { header: "navbar", content: "add_website" });
    }
});
FlowRouter.route('/ref/:username', {
    name: 'ref',
    action: function(params) {
        Session.set('ref', params.username);
        BlazeLayout.render("main", { header: "navbar", content: "register" });
    }
});

FlowRouter.route("/purchase/callback", {
    name: "paymentCallback",
    action: function(params, queryParams) {
        console.log(queryParams);
        console.log("ASDAS");
        Meteor.call("checkPayment", queryParams.payment_id, function(err, res) {
            if (err) {
                throw new Meteor.Error(404, "Sorry, Cant retrieve the payment information"); }

            if (res == "Completed") {
                alert("Thanks. Your payment is processed. You will get your benefits soon");
                window.location.href = Meteor.settings.public.site + "/account";
            }
        });
    }
});
