import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Tracker } from 'meteor/tracker';
import { $ } from 'meteor/jquery';
import { Template } from 'meteor/templating';
import alertify from 'alertifyjs';

Template.exchange.created = function() {
    document.title = "Exchange";
    this.timer = new ReactiveVar(20);
    var self = this;

    this.view_go = true;
     start = function(){
         if (self.view_go) {
            if (self.timer.get() > 1) {
                self.timer.set(self.timer.get() - 1);
                $("#seconds").html(self.timer.get());
                setTimeout("start();", 1000);
            } else {
                self.timer.set(0);
                $("#seconds").html("0");
            }
        }
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
        // if(!self.myWindow){
        self.myWindow = window.open(url, "Hitsloop", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=800,height=600, top=100, left=400,");
    // }
    }


    timing = setInterval(function() {
        if(self.myWindow){
        if (self.myWindow.closed) {
            clearInterval(timing);
            window.location = Meteor.settings.public.site+'/account';
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
        $('#startExchange').hide();
        $('#stopExchange').show();
        $('#stopExchange').css('display','block');
        $('#exchangeloadingimg').show();
        $('#exchangeloadingimg').css('display','block');
        
        var sites = [];
        var result;
        var self = this;
        
        t.site = new ReactiveVar(null);
   
       
        //  console.log(result);

       startExchange(openExchange);
        
         function openExchange(res){
             t.site.set(res);

            openWin(t.site.get().address);
            t.timer.set(res.visitDuration);

                checkWin();
                start();
              
        }
        Tracker.autorun(function(){

            
              if(t.timer.get() == 0){
                  if(!t.myWindow.closed){
                    Meteor.call('hitted',t.site.get()._id,function(err,res){

                          Meteor.call('addMinute', t.site.get()._id, function(err,res){
                                if(err){ alertify.alert("Error",err.reason); }

                        });  
                    });  
                        
                    
                  }
                    startExchange(openExchange);
                }
        });
        
       
    },
    // 'click #stopExchange': function(e,t){
        
    //     clearInterval(exchange);
    //     t.timer.set(0);
    // }
});
startExchange = function(callback){

 Meteor.call('startExchange', function(err, res) {
            if (err) {
                alertify.alert("Error",err.reason); }
            callback(res);
            
        });
}
