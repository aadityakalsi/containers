var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var hset = require('../hashset.js');

describe('HashSet', function() {
    it('can be empty', function() {
        let h = new hset();
        expect(h.size()).to.equal(0);
    });
    it('add and find one entry, not find non-existent ones', function() {
        let h = new hset();
        expect(h.size()).to.equal(0);
        h.add(1);
        expect(h.size()).to.equal(1);
        expect(h.contains(1)).to.equal(true);
        expect(h.erase(1)).to.equal(true);
        // cannot find non-existent stuff
        expect(h.contains(2)).to.equal(false);
        expect(h.erase(2)).to.equal(false);
    });
});
