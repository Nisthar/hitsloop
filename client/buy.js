import {
    Template
}
from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
// import { Session } from 'meteor/session';
//  import { $ } from 'meteor/jquery';
// import {FlowRouter} from 'meteor/kadira:flow-router';
import './buy.html';

Template.buy.rendered = function(){
    this.$('#buyVisitDuration').noUiSlider({
        start: [10],
        connect: 'lower',
        range:{
            min: [10],
            max: [60]
        }
    }).on('change', function(ev, val){
        console.log(val);
        console.log($('#buyVisitDurationHit1').html());
        console.log($('#buyVisitDurationHit1').text());
        var minute =  60 / Math.round(val) ;
        $('#buyVisitDurationHit1').html(Math.round(minute * 10000));
        $('#buyVisitDurationHit2').html(Math.round(minute * 25000));
        $('#buyVisitDurationHit3').html(Math.round(minute * 50000));
        $('#buyVisitDurationHit4').html(Math.round(minute * 100000));
        $('#buyVisitDurationHit5').html(Math.round(minute * 250000));
        $('#buyVisitDurationHit6').html(Math.round(minute * 500000));
        $('#buyVisitDurationHit7').html(Math.round(minute * 1000000));
    });
}

Template.buy.events({
   'click .payBtn': function(e,t){
       var amount = $(e.target).data('amount');
       console.log(amount);
       Meteor.call('payForTraffic',amount,function(err,res){
           if(err){
               throw new Meteor.Error(404,err.reason);
           }
           console.log(res);
           window.open(res.payment_request.longurl);
           
       });
   } 
});