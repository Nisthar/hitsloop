import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

/*Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});

*/
Template.navbar.events({
    'click #logoutBtn': function() {
        Meteor.logout();
        window.location.href = Meteor.settings.public.site;
    }
});
Template.isVerified.events({
    'click #resend-verification-link': function() {
        Meteor.call('sendVerificationLink', (error, response) => {
            if (error) {
                Bert.alert(error.reason, 'danger');
            } else {
                Bert.alert('Verification Email Sent', 'success');
                // FlowRouter.go('home');
            }
        });
    }
});
Template.recentPurchases.created = function () {
  let purchases = Subscription.find({}, { sort: { startedAt: 1 }, limit: 1 }); 
        let recentPurchases = purchases.observeChanges({
            addedBefore: (id, fields, before) => {
                Meteor.call('subOwner', fields.user_id, (err, res) => {
                    fields.username = res[0].username;
                    // this.newPurchases.set(fields);
                    // console.log(this.newPurchases.get());
                    Session.set('recentPurchases', fields);
                });
            }
        });
};
Template.recentPurchases.helpers({
    recentPurchases: function() {

      Meteor.setTimeout(function(){

                    

        if(Session.get('recentPurchases')){
         Session.set('recentPurchases',null);
      }
      },10000);
      return Session.get('recentPurchases');
    }
});



Template.editor.helpers({
 
  getFEContext: function () {
  
    let self = this;
    // self.myDoc = {
    //   _id: "asdasd",
    //   html: "sdgsdf"
    // }
    let title = $('#postTitle').val();
    console.log(title);
    return {
      // Set html content
      // _value: self.myDoc.myHTMLField,
      // Preserving cursor markers
      _keepMarkers: true,
      // Override wrapper class 
      _className: "froala-reactive-meteorized-override",

      // Set some FE options
      toolbarInline: true,
      initOnClick: false,
      tabSpaces: false,

      // FE save.before event handler function:
      "_onsave.before": function (e, editor) {
        // Get edited HTML from Froala-Editor
        //var newHTML = editor.html.get(true /* keep_markers */);
        //console.log(newHTML);
       // Meteor.call('createPost', newHTML, title, (err,res) => {
         // if(err){ Bert.alert(err.reason, 'error'); }
         // console.log(res);
        //});
        // Do something to update the edited value provided by the Froala-Editor plugin, if it has changed:
        // if (!_.isEqual(newHTML, self.myDoc.myHTMLField)) {
          // console.log("onSave HTML is :"+newHTML);
          // Post.update({_id: self.myDoc._id}, {
            // $set: {myHTMLField: newHTML}
          // });
        // }
        return false; // Stop Froala Editor from POSTing to the Save URL
      },
    }
  },
});

Template.editor.events({
  'click #postSubmit': function (e,t) {
    e.preventDefault();
    console.log(t.$('.froala-reactive-meteorized-override').froalaEditor('html.get'));
  }
});
