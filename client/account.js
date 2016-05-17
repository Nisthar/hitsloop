import { Template } from 'meteor/templating';
import alertify from 'alertifyjs';
import './account.html';

Template.account.onCreated(function() {
    document.title = "My Account";
    var self = this;
    this.mySubs = new ReactiveVar([]);
    this.myPayments = new ReactiveVar([]);
    Meteor.call('mySubs', function(err, res) {
        if (err) {
            alertify.alert("Error", err.reason);
        }

        if (res) {
            self.mySubs.set(res);
        } else {
            self.mySubs.set([]);
        }
    });
    Meteor.call('myPayments', function(err, res) {
        if (err) {
            alertify.alert("Error", err.reason);
        }

        if (res) {
            self.myPayments.set(res);
        } else {
            self.myPayments.set([]);
        }
    });

});


Template.account.helpers({
    isEqual: function(a, b) {
        return a === b;
    },
    posts: function() {
        return Post.find().fetch();
    },
    myPayments: function() {
        return Template.instance().myPayments.get();
    },
    mySubs: function() {
        return Template.instance().mySubs.get();
    },
    isSubActive: function(active) {

        if (active) {

            return "ACTIVE";
        } else {

            return "EXPIRED";
        }
    }
});

// Template.account.hitsRecieved = function() {
//     return {
//         chart: {
//             plotBackgroundColor: null,
//             plotBorderWidth: null,
//             plotShadow: false
//         },
//           xAxis: {        
//         type: 'datetime',
//         labels: {
//             formatter: function() {
//                 return Highcharts.dateFormat('%a %d', this.value);
//             }
//         }
//     },

//         title: {
//             text: 'Hits Recieved'
//         },

//     tooltip: {

//             formatter: function() {
//                 return '<b>'+ Highcharts.dateFormat('%e %b',
//                                           new Date(this.x))
//                 + ' </b> <br/> Hits: ' + this.y + '';
//             }

//         },


//     series: [{
//         data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
//         pointStart: Date.UTC(2016, 10, 1),
//         pointInterval: 24 * 3600 * 1000 // one day
//     }]
//     };
// };
