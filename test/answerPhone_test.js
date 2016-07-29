var assert = require("chai").assert;
var expect = require("chai").expect;
var sinon = require("sinon");
var answerPhone = require("../answerPhone.js");

describe("answerPhone", function () {
  it("exports handler", function () {
    assert.typeOf(answerPhone.handler, "function");
  });

  // it("does not crash", function () {
  //   event = {
  //     AccountSid: "1234",
  //     CalledCity: "Evanston",
  //     CallerCity: "Denver"
  //   }
  //   var s3_response = { method: function () {} };
  //   var aws_mock = sinon.mock(AWS);
  //   s3_mock.expects("getObject").once(s3_params, mycallback);
  //   result = answerPhone.handler(event, null)
  //   // assert.ok(result);
  // })

});

// describe("voicemailFilename", function () {
//   it("is a function", function() {
//     assert.typeOf(voicemailFilename, "function");
//   });

//   it("concatenates filename", function () {
//     var result = voicemailFilename("Dave")
//     assert.ok(result);
//   });
// })


// describe("say Functions", function () {
//   it("sayHeader", function() {
//     assert.typeOf(sayHeader, "function")
//     assert.ok(sayHeader)
//   })

//   it("sayFooter", function() {
//     assert.typeOf(sayFooter, "function")
//     assert.ok(sayFooter)
//     assert.equal(sayFooter(), "</Say>")
//   })
//   it("smsHeader", function() {
//     assert.typeOf(smsHeader, "function")
//     assert.ok(smsHeader)
//   })

//   it("smsFooter", function() {
//     assert.typeOf(smsFooter, "function")
//     assert.ok(smsFooter)
//     assert.equal(smsFooter(), "</Sms>")
//   })
// })
