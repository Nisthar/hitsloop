import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import  moment  from 'moment';

Template.registerHelper('fromNow', function(date) {
  if (date)
    return moment(date).fromNow(true);
});

Template.registerHelper('site', function(){
  return Meteor.settings.public.site;
});
