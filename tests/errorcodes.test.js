var _ = require('lodash');
var should = require('should');

describe('errorcodes', function ( ) {

  var errorcodes = require('../lib/plugins/errorcodes')();

  var now = Date.now();
  var env = require('../env')();
  var ctx = {};
  ctx.data = require('../lib/data')(env, ctx);
  ctx.notifications = require('../lib/notifications')(env, ctx);


  it('Not trigger an alarm when in range', function (done) {
    ctx.notifications.initRequests();
    ctx.data.sgvs = [{y: 100, x: now}];

    var sbx = require('../lib/sandbox')().serverInit(env, ctx);
    errorcodes.checkNotifications(sbx);
    should.not.exist(ctx.notifications.findHighestAlarm());

    done();
  });

  it('should trigger a urgent alarm when ???', function (done) {
    ctx.notifications.initRequests();
    ctx.data.sgvs = [{y: 10, x: now}];

    var sbx = require('../lib/sandbox')().serverInit(env, ctx);
    errorcodes.checkNotifications(sbx);
    ctx.notifications.findHighestAlarm().level.should.equal(ctx.notifications.levels.URGENT);

    done();
  });

  it('should trigger a urgent alarm when hourglass', function (done) {
    ctx.notifications.initRequests();
    ctx.data.sgvs = [{y: 9, x: now}];

    var sbx = require('../lib/sandbox')().serverInit(env, ctx);
    errorcodes.checkNotifications(sbx);
    ctx.notifications.findHighestAlarm().level.should.equal(ctx.notifications.levels.URGENT);

    done();
  });

  it('should trigger a low notification when needing calibration', function (done) {
    ctx.notifications.initRequests();
    ctx.data.sgvs = [{y: 5, x: now}];

    var sbx = require('../lib/sandbox')().serverInit(env, ctx);
    errorcodes.checkNotifications(sbx);
    should.not.exist(ctx.notifications.findHighestAlarm());
    _.first(ctx.notifications.findInfos()).level.should.equal(ctx.notifications.levels.LOW);

    done();
  });

});