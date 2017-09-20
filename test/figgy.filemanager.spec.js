// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage
var config = require('../nightwatch.conf.js');

module.exports = { // adapted from: https://git.io/vodU0
  before: function (browser, done) {
  	server = require('../server')(done) // done is a callback that executes when the server is started
  },

  after: function () {
  	server.close()
  },

  'default e2e tests': function(browser) {
    browser
      .url('localhost:3000')
      .waitForElementVisible('#sortable', 5000)
      .assert.elementPresent('.thumbnail')
      //.assert.containsText('.caption:first', '1')
      .assert.elementCount('#sortable img', 32)
      .end()
  }
};
