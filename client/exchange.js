import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { $ } from 'meteor/jquery';
import { Template } from 'meteor/templating';

Template.exchange.created = function() {
    this.timer = new ReactiveVar(20);
    var self = this;

    this.view_go = true;
    start = function() {


                // $.ajax({
                //     type: "POST",
                //     url: "http://youliketraffic.com/members/earn-traffic-completed.php",
                //     data: "site=" + response + "&user=" + userid,
                //     success: function(msg) {
                //         refreshpage();
                //     }
                // });

            }
    view_go = true;
    play = function() {
        if (!self.view_go) {
            self.view_go = true;
            start();
        }
        return false;
    }
    pause = function() {
        if (view_go) {
            self.view_go = false;
        }
        return false;
    }
    this.myWindow;
    checkWin = function() {
        if (!self.myWindow) {
            alert('ERROR! - Please enable popups and then refresh the page.');
            pause();
            setTimeout("checkWin();", 10);
        }
         if(self.myWindow){
        if (self.myWindow.closed) {
            pause();
            setTimeout("checkWin();", 10);
        } else {
            setTimeout("checkWin();", 10);
        }
    }
    }

    openWin = function(url) {
        if(!self.myWindow){
        self.myWindow = window.open(url, "YouLikeTraffic", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=800,height=600, top=100, left=400,");
    }
    }


    timing = setInterval(function() {
        if(self.myWindow){
        if (self.myWindow.closed) {
            clearInterval(timing);
            window.location = 'http://localhost:3000/account';
        }
    }
    }, 1000);


    closeWin = function() {
        if (self.myWindow) {
            self.myWindow.close();
            pause();
        }
    }



    refreshpage = function() {

        window.location = document.location.href;
    }
}

Template.exchange.events({
    'click #startExchange': function(e, t) {
        let sites = [];
        let result;
   
        //  console.log(result);

        setInterval(startExchange(openExchange),5000);

         function openExchange(res){
            openWin(res.address);

            console.log(t.timer.get());
                checkWin();
                start();
              
        }
        function checkTime(){
            console.log("checkTime()");
            console.log(t.timer.get());
              if(t.timer.get() == 0){
                    startExchange(openExchange);
                    console.log("traffic sent successfully");
                }
        }
        function start(){
         if (view_go) {
            if (t.timer.get() > 1) {
                t.timer.set(t.timer.get() - 1);
                $("#seconds").html(t.timer.get());
                setTimeout("start();", 1000);
            } else {
                t.timer.set(0);
                $("#seconds").html("0");
            }
        }
    }
        setInterval(checkTime,5000);
        // // });
        //     console.log(sites);

    }
});
startExchange = function(callback){
    console.log("startExchange()");
 Meteor.call('startExchange', function(err, res) {
            if (err) {
                throw new Meteor.Error(404, "Something went wrong"); }
            callback(res);
            
        });
}
