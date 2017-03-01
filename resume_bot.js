var twitterAPI = require('node-twitter-api');
var util = require('util');
var fs = require('fs');
var rita = require('rita');


var consumerKey = '';
var consumerSecret = '';
var accessToken = '';
var tokenSecret = '';
var myScreenName = '';

var twitter = new twitterAPI({
    consumerKey: consumerKey,
    consumerSecret: consumerSecret});

var resume = JSON.parse(fs.readFileSync("resume.json"));
var resumeData = resume["patrick"];

twitter.getStream("user", {}, accessToken, tokenSecret, onData);

function onData(error, streamEvent) {

    var delayMillis = 1000; //1 second

    setTimeout(function() {
    //your code to be executed after 1 second

    // case 1: if the object is empty, simply return
    if (Object.keys(streamEvent).length === 0) {
        return;
    }
    //Tweet && follow back when people follow you
    else if (streamEvent.hasOwnProperty('event')) {
        var followerHandle = streamEvent['source']['screen_name'];
        // a new follower!
        if (streamEvent['event'] == 'follow') {
            console.log("followed by @" + followerHandle);
            twitter.statuses(
                "update",
               {"status": "@" + followerHandle + "! DM me if you want to ask questions about my experience!"},
               accessToken,
               tokenSecret,
               function (err, data, resp) { console.log(err); }
            );
            //auto-follow when someone follows you
            twitter.friendships(
                "create",
                {"screen_name": followerHandle,"follow": true},
                accessToken,
                tokenSecret,
                function(err,data,resp){console.log(err);}
            );
        }
    }      

    // 'direct_message' key indicates this is an incoming direct message
    else if (streamEvent.hasOwnProperty('direct_message')) {

        var dmText = streamEvent['direct_message']['text'];
        var senderName = streamEvent['direct_message']['sender']['screen_name'];
        // streaming API sends us our own direct messages! skip if we're
        // the sender.
        if (senderName == myScreenName) {
            return;
        }

        //variable to access RiString class 
        var rs = rita.RiString(dmText);
        //creates array list of words
        var dmWords = rs.words();
        //create word list
        var textWords = rs.text();

        //hello keywords
        var helloWords = ['hello', 'hi', 'hey', 'yo', 'sup']
        //contact keywords
        var contactWords = ['contact', 'reach you'];
        //education keywords
        var educationWords = ['school', 'education','study', 'studying', 'college'];
        //experience keywords 
        var experienceWords = ['experience', 'work', 'company'];
        //responsibilities keywords
        var resWords = ['managed', 'responsibilities'];

        var flag = true;

        for (var i = 0; i < dmWords.length; i++){
            if (helloWords.indexOf(dmWords[i]) != -1){
               
                    twitter.direct_messages('new',
                        {
                            "screen_name": senderName,
                            //"you just said " + dmText + "!" +
                            // "text": resumeData[0].experience[0].company},
                            "text": "Hi! I'm Patrick's resume bot. You can learn about his experience by asking him simple questions. I'm pretty limited though."},
                        accessToken,
                        tokenSecret,
                        function (err, data, resp) { console.log(err); }
                    );
                    flag = false;
                    break;  
                }
            else if (contactWords.indexOf(dmWords[i]) != -1){

                    twitter.direct_messages('new',
                        {
                            "screen_name": senderName,
                            "text": "I'm glad you want to get in contact! How would you like to get in touch? Linkedin/Email/Website/Mobile"},
                        accessToken,
                        tokenSecret,
                        function (err, data, resp) { console.log(err); }
                    );
                    flag = false;
                    break;         
            } 
            //ways to contact me
            else if (dmWords[i] == 'linkedin'){
                    twitter.direct_messages('new',
                        {
                            "screen_name": senderName,
                            "text": resumeData[0].contact.linkedin},
                        accessToken,
                        tokenSecret,
                        function (err, data, resp) { console.log(err); }
                    );
                    flag = false;
                    break;
            }
            else if (dmWords[i] == 'email'){
                    twitter.direct_messages('new',
                        {
                            "screen_name": senderName,
                            "text": resumeData[0].contact.email},
                        accessToken,
                        tokenSecret,
                        function (err, data, resp) { console.log(err); }
                    );
                    flag = false;
                    break;
            }
            else if (dmWords[i] == 'mobile'){
                    twitter.direct_messages('new',
                        {
                            "screen_name": senderName,
                            "text": resumeData[0].contact.mobile},
                        accessToken,
                        tokenSecret,
                        function (err, data, resp) { console.log(err); }
                    );
                    flag = false;
                    break;
            }
            else if (dmWords[i] == 'website'){
                    twitter.direct_messages('new',
                        {
                            "screen_name": senderName,
                            "text": resumeData[0].contact.website},
                        accessToken,
                        tokenSecret,
                        function (err, data, resp) { console.log(err); }
                    );
                    flag = false;
                    break;
            }
            else if(educationWords.indexOf(dmWords[i]) != -1) {
                    
                    twitter.direct_messages('new',
                        {
                            "screen_name": senderName,
                            "text": "I'm currently in enrolled at " + resumeData[0].education[1].school + "pursuing my " + resumeData[0].education[1].degree + " in " + resumeData[0].education[1].major},
                        accessToken,
                        tokenSecret,
                        function (err, data, resp) { console.log(err); }
                    );
                    flag = false;
                    break; 

            }
            else if(experienceWords.indexOf(dmWords[i]) != -1) {
                    
                    twitter.direct_messages('new',
                        {
                            "screen_name": senderName,
                            "text": "I was most recently at " + resumeData[0].experience[1].company + " as a " + resumeData[0].experience[1].role},
                        accessToken,
                        tokenSecret,
                        function (err, data, resp) { console.log(err); }
                    );
                    flag = false;
                    break; 

            }
            else if(resWords.indexOf(dmWords[i]) != -1) {
                    
                    twitter.direct_messages('new',
                        {
                            "screen_name": senderName,
                            "text": resumeData[0].experience[1].responsibilities[Math.floor(Math.random() * resumeData[0].experience[1].responsibilities.length)]},
                        accessToken,
                        tokenSecret,
                        function (err, data, resp) { console.log(err); }
                    );
                    flag = false;
                    break; 

            }



        }
    }   

    // if none of the previous checks have succeeded, just log the event
    else {
        console.log(streamEvent);
    }

    }, delayMillis);
}
