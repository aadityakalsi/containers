var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var hset = require('../hashset.js');

// var vp = require('v8-profiler');
// var fs = require('fs');

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
        h.add(1);
        expect(h.size()).to.equal(1);
        expect(h.contains(1)).to.equal(true);
        expect(h.erase(500)).to.equal(false);
        expect(h.erase(1)).to.equal(true);
        // cannot find non-existent stuff
        expect(h.contains(2)).to.equal(false);
        expect(h.erase(2)).to.equal(false);
        // add mixed elem
        h.add(new Date());
        h.add({1:1, 2:3});
    });
    it('can pass a stress test', function() {
        let h = new hset();
        for (let i = -500; i < 500; ++i) {
            expect(h.contains(i)).to.equal(false);
            h.add(i);
            expect(h.size()).to.equal(500+i+1);
        }
        for (let i = -500; i < 500; ++i) {
            expect(h.contains(i)).to.equal(true);
            expect(h.erase(i)).to.equal(true);
            expect(h.size()).to.equal(500-i-1);
        }
    });
    it('rehash 0 does >0 rehash', function() {
        let h = new hset();
        expect(h.cap()).to.equal(0);
        h.rehash(0);
        expect(h.cap()).to.equal(25);
        h.add(-1);
        expect(h.cap()).to.equal(25);
        expect(h.size()).to.equal(1);
        h.erase(-1);
        expect(h.cap()).to.equal(25);
        expect(h.size()).to.equal(0);
    });
});

describe('HsetPerf', function() {
    let h = new hset();
    it('hsetInsertPerf', function() {
        for (let i = 0; i < 1e6; ++i) {
            h.add(i);
        }
    });
    let c = new Set();
    it('setInsertPerf', function() {
        // vp.startProfiling('hsetAdd', true);
        for (let i = 0; i < 1e6; ++i) {
            c.add(i);
        }
        // let p = vp.stopProfiling();
        // p.export(function(err, res) {
        //     fs.writeFileSync('add-profile.json', res);
        //     p.delete();
        // });
    });
    it('hsetContainsPerf', function() {
        for (let i = 0; i < 1e6; ++i) {
            h.contains(i);
        }
    });
    it('setContainsPerf', function() {
        for (let i = 0; i < 1e6; ++i) {
            c.has(i);
        }
    });
    it('hsetErasePerf', function() {
        for (let i = 0; i < 1e6; ++i) {
            h.erase(i);
        }
    });
    it('setErasePerf', function() {
        for (let i = 0; i < 1e6; ++i) {
            c.delete(i);
        }
    });
});
