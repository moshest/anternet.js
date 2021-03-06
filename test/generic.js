const assert = require('assert');
const Anternet = require('../');
const { describe, it } = global;

describe('generic', () => {
  it('should run README example', (done) => {
    const address = '127.0.0.1';
    const port = 12345;
    const testArgs = ['foo', 'bar'];

    const msgType = 1;

    // peer 1
    const anternet1 = new Anternet();
    anternet1.bind(port);

    anternet1.on(msgType, (rid, args, rinfo) => {
      assert.deepEqual(args, testArgs);
      anternet1.response(rid, args.reverse(), rinfo.port, rinfo.address);
    });

    // peer 2
    const anternet2 = new Anternet();
    anternet2.request(msgType, testArgs, port, address, (err, args, rinfo) => {
      if (err) return done(err);

      assert.deepEqual(args, ['bar', 'foo']);
      assert.equal(rinfo.address, address);
      assert.equal(rinfo.port, port);

      done();
    });
  });
});
