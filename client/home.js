import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';


Template.home.onCreated(function(){
  document.title = "HitsLoop | Home";
  if(Meteor.user()){
    window.location.href = Meteor.settings.public.site + "/account";
  }
});

Template.home.onRendered(function(){
    var counter;
  if(window.localStorage.getItem('counter') != undefined){
     counter = window.localStorage.getItem('counter');
  }else{
   counter = 18560;
 }
  var hits = $('#hits');

  


(function loop() {
    var rand = Math.round(Math.random() * (3000 - 500)) + 500;
    setTimeout(function() {
            counter++; 
            hits.html(counter); 
            window.localStorage.setItem('counter',counter);
            loop();  
    }, rand);
}());
});
