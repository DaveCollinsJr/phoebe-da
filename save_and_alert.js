console.log('Loading saveAndAlert function');

/* Twilio calls this (our callback, via URL) with these parameters:
  RecordingUrl:        the URL of the recorded audio
  RecordingDuration:   the duration of the recorded audio (in seconds)
  Digits:              the key (if any) pressed to end the recording or 'hangup' if the caller hung up

  This Lambda is responsible for:
    1) Authenticating the Twilio call
    2) Gathering the Voicemail recording from Twilio and saving locally
        Twilio will return a recording in binary WAV audio format by default. To request the recording
        in MP3 format, append ".mp3" to the RecordingUrl.
    3) Sending an SMS to me so we know about the call

    Test Configuration:
    {
      "AccountSid": "YourAccountKeyHere",
      "RecordingUrl": "http://foo.com/sample_voicemail",
      "CallerName": "Test Caller"
    }

*/

var AWS         = require('aws-sdk');
var https       = require('https');
var querystring = require('querystring');


voicemailFilename = function(caller_name) {
    // Make a nice yyyy-mm-dd-hh-mm-caller_name file
    // caller_name:  "SMITH JOHN"
    var current_time = new Date();
    var filename = current_time.getFullYear().toString() + "-" +
              (current_time.getMonth()+1).toString() + "-" +
              current_time.getDate().toString() + "-" +
              current_time.getHours().toString() + "-" +
              current_time.getMinutes().toString() + "-" +
              current_time.getSeconds().toString() + "-" +
              caller_name.replace(" ","_");
    return filename;
    };


smsAlerter = function(error, message, environment, context, callback, callback_message) {
    callback = (typeof callback === 'function') ? callback : function() {};

    var postData = querystring.stringify({
      'From' : environment.twilio.phoebe_number,
      'To'   : environment.twilio.alert_phone_number,
      'Body' : message
    });
    console.log("(smsAlerter) message:" + message);

    // See https://nodejs.org/dist/latest-v4.x/docs/api/https.html#https_https_request_options_callback
    var options = {
        hostname: 'api.twilio.com',
        method: 'POST',
        path: '/2010-04-01/Accounts/' + environment.twilio.account_sid + '/Messages.json',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        },
        auth: environment.twilio.account_sid + ':' + environment.twilio.auth_token
    };
    console.log("(smsAlerter) options.path:" + options.path);

    var request = https.request(options, function (response) {
      console.log('(smsAlerter) STATUS: ' + response.statusCode);
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        console.log('(smsAlerter) response data event');
      });
      response.on('end', function () {
        console.log('(smsAlerter) response end event. Calling callback');
        callback(null, callback_message, environment, context);
      });
      response.on('error', function (error) {
        console.log('(smsAlerter) response Error received: ' + error);
      });
    });
    request.on('error', function (e) {
      console.log('(smsAlerter) problem with request: ' + e.message);
    });
    request.write(postData);
    request.end();
    console.log("(smsAlerter) Have ended the request");
};


twimlCallback = function(error, message, environment, context) {
    var twimlHeader       = '<?xml version="1.0" encoding="UTF-8"?>';
    var responseHeader    = '<Response>';
    var responseFooter    = '</Response>';
    var sayHeader         = '<Say voice="alice" language="en-gb">';
    var sayFooter         = '</Say>';
    var smsHeader         = '<Sms from="' + environment.twilio.phoebe_number + '" to="' + environment.twilio.alert_phone_number + '">';
    var smsFooter         = '</Sms>';

    if (error) {
        console.log('(twimlCallback) ERROR');
    }
    else {
        console.log('(twimlCallback) returning success and twiml');
        var full_callback_message = twimlHeader + responseHeader + sayHeader + message + sayFooter + responseFooter;
        context.succeed(full_callback_message);
    }
};


exports.handler = function(event, context) {
    console.log( "event", event );
    var recording_url           = event.RecordingUrl;
    var caller_name             = event.CallerName;

    console.log("(handler) recording_url:" + recording_url);

    var s3 = new AWS.S3();
    var param = {Bucket: 'dc-cloud-phoebe', Key: 'config/environment.json'};
    s3.getObject(param, function(err, auth_data) {
        if(err) {
            context.fail("Failure reading authentication file - S3 Error");
            console.log(err, err.stack);
        }
        else {
            console.log("(handler) Parsing Environment file");
            var environment = JSON.parse(auth_data.Body);
            if (event.AccountSid == environment.twilio.account_sid)
            {
                var voicemail_file = {Bucket: 'dc-cloud-phoebe/voicemails', Key: voicemailFilename(caller_name), Body: recording_url};
                var sms_notice = 'Saving voicemail';
                var recording_notice = 'Recording URL';

                console.log("(handler) Starting s3 Upload: " + caller_name);
                s3.upload(voicemail_file, function(err, voicemail_data) {
                    if (err) {
                        console.log("(handler) S3 ERROR:" + err, err.stack);
                        var bummer = 'So sorry, I had trouble saving the voicemail';
                        sms_notice = 'Error saving voicemail from ' + caller_name;
                        smsAlerter(null, sms_notice, environment, twimlCallback(null, bummer, environment, context));
                    }
                    else {
                        console.log('(handler) Uploaded file:' + voicemail_data);
                        var inform_voicemail_sent = 'I have sent your voicemail to Dave. Bye!';

                        // We send TWO text messages in case the message containing URL causes issues on the receiving phone
                        sms_notice = 'Call from ' + caller_name;
                        recording_notice = 'URI: ' + recording_url;
                        console.log('(handler) Defining smsCallDetails');

                        var formatTwimlResponse = function(err, message, environment, context) {
                            console.log("(smsCallDetails) Calling twimlCallback to render final Twiml");
                            twimlCallback(err, message, environment, context);
                        };

                        var smsCallDetails = function(err, message, environment, context) {
                            console.log("(smsCallDetails) Calling smsAlerter with recording_notice");
                            smsAlerter(null, recording_notice, environment, context, formatTwimlResponse, inform_voicemail_sent);
                        };

                        console.log('(handler) Calling smsAlerter with sms_notice');
                        smsAlerter(null, sms_notice, environment, context, smsCallDetails, null);
                    }
                });
            }
            else {
                context.fail("(handler) Authentication Failed");
            }
        }
    });
}
