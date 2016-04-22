import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { HTTP } from 'meteor/http';

import Insta from 'instamojo-nodejs';

Meteor.startup(() => {
    // code to run on server at startup

});

Meteor.methods({
    addWebsite: (data) => {
        let freeLimit = 3;
        let sites = Website.find({user_id: Meteor.userId()}).fetch();
        if (Meteor.user().profile.accountType == "free" && sites.length >= 3) {
            throw new Meteor.Error(404, "You used all your free website slots. Please subscribe to premium membership to add more websites");
        } else {
            let result = Website.insert({ user_id: Meteor.userId(), address: data.address, hits: data.hits, totalLimit: data.totalLimit, hourlyLimit: data.hourlyLimit, visitDuration: data.visitDuration, status: data.status, active: data.active   });
            if (result) {
                console.log("Added new website");
                return true;
            } else {
                return false;
            }

        }
    },
    mySites: () => {
      
      let sites = Website.find({user_id: Meteor.userId()}).fetch();
      return sites;
    },
    editSite: (id,action) => {
     let site = Website.find({user_id:id}).fetch();
     // if(site[0]._id != Meteor.userId()){
     //  throw new Meteor.Error(404, "Sorry, You do not have enough privileges to do it.");
     // }else{
      console.log(site);
        switch (action) {
          case "play":
            let play = Website.update({user_id: Meteor.userId(),_id:id},{$set:{active : true}});
            if(play){
              return true;
            }else{
              return false;
            }
            break;
          case "pause":
           let pause = Website.update({user_id: Meteor.userId(),_id:id},{$set:{active : false}});
             if(pause){
              return true;
            }else{
              return false;
            }
            break;
          case "delete":
          Website.remove({_id:id});
             
           
            break;
          default:
            break;
        }
     // }
    },
    startExchange: () => {

      let sites = Website.findOne({user_id: {$ne: Meteor.userId()}},{sort:{hits: 1}});
      console.log(sites);
        return sites;

      },
      hitted: function(siteId){
        var site = Website.findOne({_id: siteId});
        if(!site || !Meteor.userId()){
          throw new Meteor.Error(404, "You can't do that");
        }
        var hit = Website.update({_id:siteId},{$inc:{hits:1}});
       
        if(hit){
          return true;
        }else{
          return false;
        }
      },
      addMinute: function(siteId){
        if(!Meteor.userId()){
          throw new Meteor.Error(404, "You can't do that");
        }
         var minute = Meteor.users.update({_id: Meteor.userId()},{$inc:{"profile.minutes":1}});
         var siteOwner = Website.findOne({_id: siteId});
         var timeVisited = siteOwner.visitDuration / 60;
         var reduceMinute = Meteor.users.update({_id: siteOwner.user_id},{$inc: {"profile.minutes": -timeVisited}});
         if(minute){
           return true;
         }else{
           return false;
         }
      },
      payForTraffic: function(amount){
      //  var response =  HTTP.post('https://www.instamojo.com/api/1.1/payment-requests/',{ data: {
      //     "purpose": "dsfsdfsd",
      //     "amount":"20",
         
      //   },
      //   headers: {
      //     "api_key":"793987cc6b04bd55a497c2001c79501e",
      //     "auth_token":"7b354d6fdb7c7a5e91d362925d917b64"
      //   }
      // });
      // if(response){
      //   return response;
      // }else{
      //   return false;
      // }
      Insta.setKeys("793987cc6b04bd55a497c2001c79501e", "7b354d6fdb7c7a5e91d362925d917b64");
      var data = new Insta.PaymentData();
 
data.purpose = "Test";            // REQUIRED 
data.amount = 9;                  // REQUIRED 
data.setRedirectUrl("http://localhost:3000/buy#");
 
 var pay = Meteor.wrapAsync(Insta.createPayment,Insta);
 
var response = pay(data);
var payment = Payment.insert({user_id: Meteor.userId(), payment_id: response.payment_request.id, amount: response.payment_request.amount, purpose: response.payment_request.purpose, status: response.payment_request.status, created_at: response.payment_request.created_at})
console.log(response);
if(payment){
return response;
}else{
  throw new Meteor.Error(404, "Can't insert your payment details into the DB");
}
      }
    
});
