var assert = require("chai").assert;
var expect = require("chai").expect;
var saveAndAlert = require("../save_and_alert.js");

describe("saveAndAlert", function () {
  it("exports handler", function () {
    assert.typeOf(saveAndAlert.handler, "function");
  });

  it("does not crash", function () {
    event = {
      RecordingUrl: "https://davecollins.cloud/123.mp3",
      CallerName: "DAVE COLLINS"
    }
    result = saveAndAlert.handler(event, null)
    // assert.ok(result);
  })

});

describe("voicemailFilename", function () {
  it("is a function", function() {
    assert.typeOf(voicemailFilename, "function");
  });

  it("concatenates filename", function () {
    var result = voicemailFilename("Dave")
    assert.ok(result);
  });
})


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
