# Phoebe
A cloud-based personal digital assistant using AWS Lambda and Twilio for serverless IVR.

This is currently in "Part 1" status where Phoebe will answer the phone, record a voicemail, and send you an SMS with the voicemail.

![Overview Diagram](images/ivr_overview.jpg)


Part 2 will be incorporating a DynamoDB contact database and forwarding callers in real-time if they make the cut!

#Installation

Please see the detailed [step by step instructions](http://davecollins.cloud/lambda_ivr_1.html) at www.davecollins.cloud



#Test Suite
You'll need Node.js (4.6 or better) installed as well as mocha test suite

type the "mocha" command to run the test suite

    mocha

    answerPhone
      ✓ exports handler

    saveAndAlert
      ✓ exports handler
    event { RecordingUrl: 'https://davecollins.cloud/123.mp3',
      CallerName: 'DAVE COLLINS' }
    (handler) recording_url:https://davecollins.cloud/123.mp3
      ✓ does not crash (149ms)

    voicemailFilename
      ✓ is a function
      ✓ concatenates filename


#Issues
Feel free to raise an issue on Github with questions, or fork and raise a Pull Request if you'd like to make changes.

I would especially welcome any help on the mocha testing side!  Would love to stub out the S3 calls and have some real tests in here


#Recommended Reading

https://www.twilio.com/blog/2015/09/build-your-own-ivr-with-aws-lambda-amazon-api-gateway-and-twilio.html

http://edwinvelazquez.com/blog/2015/12/15/build_an_aws_endpoint.html

