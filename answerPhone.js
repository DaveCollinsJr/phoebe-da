console.log('Loading answerPhone function');

/* Test Configuration
    {
      "AccountSid": "YourAccountKeyHere",
      "CalledCity": "Denver",
      "CallerCity": "Evanston"
    }
*/

var AWS = require('aws-sdk');

exports.handler = function(event, context) {
    console.log( "event", event );
    var output = "";
    var called_city = event.CalledCity;
    var caller_city = event.CallerCity;

    var s3 = new AWS.S3();
    var auth_file = {Bucket: 'dc-cloud-phoebe', Key: 'config/environment.json'};
    s3.getObject(auth_file, function(err, auth_data) {
        if(err) {
            context.fail("Failure reading authentication file - S3 Error");
            console.log(err, err.stack);
        }
        else {
            // Parse JSON file and put it in environment variable
            var environment = JSON.parse(auth_data.Body);

            if (event.AccountSid == environment.twilio.account_sid)
            {
                var header = '<?xml version="1.0" encoding="UTF-8"?><Response><Pause length="2"/>';
                var greeting = '<Say voice="alice" language="en-gb">Hello, I\'m Phoebe, the Cloud-based Assistant of Dave Collins.';
                greeting += 'Please leave a voicemail and Dave will get back to you as soon as possible.</Say>';
                var vm_prompt = '<Record action="' + environment.staging.saver_script + '" method="GET" maxLength="20" finishOnKey="*"/>';
                var vm_nomessage = '<Say>I did not receive a recording</Say></Response>';

                output = header + greeting + vm_prompt + vm_nomessage;

                context.succeed(output);
            }
            else {
                context.fail("Authentication Failed");
            }
        }
    });
};