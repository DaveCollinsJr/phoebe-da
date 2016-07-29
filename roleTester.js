console.log('Loading roleTester function');

/* Test Configuration
    {"twilio": {"AccountSid": "YourAccountKeyHere"}}
*/

var AWS = require('aws-sdk');

exports.handler = function(event, context) {
    console.log( "event", event );
    var output = ""

    var s3 = new AWS.S3();
    var auth_file = {Bucket: 'dc-cloud-phoebe', Key: 'config/environment.json'};
    s3.getObject(auth_file, function(err, auth_data) {
        if(err) {
            context.fail("Failure reading authentication file - S3 Error")
            console.log(err, err.stack);
        }
        else {
            // Parse JSON file and put it in environment variable
            var environment = JSON.parse(auth_data.Body);

            if (event.AccountSid == environment.twilio.account_sid)
            {
                console.log("Success");
                context.succeed("Sucess");
            }
            else {
                context.fail("Authentication Failed");
            }
        }
    });
};