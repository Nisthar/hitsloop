import {FlowRouter} from 'meteor/kadira:flow-router';
FlowRouter.route('/',{
  name: 'home',
  action: function(params){
    BlazeLayout.render("main",{header: "navbar"});
  }
});
FlowRouter.route('/register',{
  name: 'register',
  action: function(params){
    BlazeLayout.render("main",{header: "navbar", content: "register"});
  }
});
FlowRouter.route('/login',{
  name: 'login',
  action: function(params){
    BlazeLayout.render("main",{header: "navbar", content: "login"});
  }
});

function addActiveClass(){
  let selector = '.'+FlowRouter.current().path.substr(1)+'';
  console.log("Selector:" + selector);
  $('li.active').removeClass('active');
  $(selector).addClass('active');
}

FlowRouter.route('/account',{
  triggersEnter: [ addActiveClass ],
  action: function(params){
    BlazeLayout.render("main",{header: "navbar", content: "account"});
  }
});
FlowRouter.route('/websites',{
  triggersEnter: [ addActiveClass ],
  action: function(params){
    BlazeLayout.render("main",{header: "navbar", content: "websites"});
  }
});
FlowRouter.route('/exchange',{
  triggersEnter: [ addActiveClass ],
  action: function(params){
    BlazeLayout.render("main",{header: "navbar", content: "exchange"});
  }
});
FlowRouter.route('/buy',{
  triggersEnter: [ addActiveClass ],
  action: function(params){
    BlazeLayout.render("main",{header: "navbar", content: "buy"});
  }
});
FlowRouter.route('/referrals',{
  triggersEnter: [ addActiveClass ],
  action: function(params){
    BlazeLayout.render("main",{header: "navbar", content: "referrals"});
  }
});
FlowRouter.route('/support',{
  triggersEnter: [ addActiveClass ],
  action: function(params){
    BlazeLayout.render("main",{header: "navbar", content: "support"});
  }
});

FlowRouter.route('/websites/new',{
  action: function(params){
    BlazeLayout.render("main",{ header: "navbar", content: "add_website"});
  }
});
