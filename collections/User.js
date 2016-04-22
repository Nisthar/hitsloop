// Schema = {};

// Schema.UserProfile = new SimpleSchema({
//     accountType: {
//         type: String,
//         optional: true
//     },
//     minutes: {
//         type: Number,
//         optional:true,
//         defaultValue: 0
//     },
//     websites: {
//         type: Array,
//         optional: true
//     },
//     "websites.$": {
//         type: Object,
//         optional: true
//     },
//     "websites.$.address":{
//         type: String,
//         regEx: SimpleSchema.RegEx.Url,
//         optional: true
//     },
//     "websites.$.hits": {
//         type: Number,
//         optional: true
//     },
    
//     "websites.$.totalLimit": {
//         type: String,
//         optional: true
//     },
//     "websites.$.hourlyLimit": {
//         type: String,
//         optional: true
//     },
//     "websites.$.visitDuration": {
//         type: String,
        
//         optional: true
//     },
//     "websites.$.status": {
//         type: String,
//         optional: true
//     },
//       "websites.$.active": {
//         type: Boolean,
//         optional: true
//     }
// });

// Schema.User = new SimpleSchema({
//     username: {
//         type: String,
//         optional: true
//     },
    
//     emails: {
//         type: Array,
//         optional: true
//     },
//     "emails.$": {
//         type: Object
//     },
//     "emails.$.address": {
//         type: String,
//         regEx: SimpleSchema.RegEx.Email
//     },
//     "emails.$.verified": {
//         type: Boolean
//     },

//     createdAt: {
//         type: Date,
//         optional: true,
//         autoValue: function(){
//             return new Date;
//         }
//     },
//     profile: {
//         type: Schema.UserProfile,
//         optional: true
//     },
//     // Make sure this services field is in your schema if you're using any of the accounts packages
//     services: {
//         type: Object,
//         optional: true,
//         blackbox: true
//     },

 
//     // In order to avoid an 'Exception in setInterval callback' from Meteor
//     heartbeat: {
//         type: Date,
//         optional: true
//     }
// });

// Meteor.users.attachSchema(Schema.User);
