var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var list = require('../list.js');

describe('List', function() {
    it ('can be empty', function() {
        var l = new list();
        expect(l.size()).to.equal(0);
    });
    it ('can be appended to at either end', function () {
        var l = new list();
        l.push_front(1);
        expect(l.size()).to.equal(1);
        expect(l.begin().value()).to.equal(1);
        l.push_back(2);
        expect(l.size()).to.equal(2);
        expect(l.begin().value()).to.equal(1);
        expect(l.begin().next().value()).to.equal(2);
        l.splice(l.begin(), l.begin().next());
        expect(l.begin().value()).to.equal(2);
        expect(l.begin().next().value()).to.equal(1);
        l.erase(l.begin());
        expect(l.size()).to.equal(1);
        expect(l.begin().value()).to.equal(1);
        l.erase(l.begin());
        expect(l.size()).to.equal(0);
        l.push_back(1);
        l.push_back(2);
        expect(l.size()).to.equal(2);
        expect(l.begin().value()).to.equal(1);
        expect(l.begin().next().value()).to.equal(2);
    });
    it ('can be spliced correctly', function () {
        var l = new list();
        l.push_front(1);
        l.push_back(2);
        l.push_back(3);

        l.splice(l.begin().next(), l.last());
        expect(l.begin().value()).to.equal(1);
        expect(l.begin().next().value()).to.equal(3);
        expect(l.begin().next().next().value()).to.equal(2);

        l.splice(l.begin(), l.begin().next());
        expect(l.begin().value()).to.equal(3);
        expect(l.begin().next().value()).to.equal(1);
        expect(l.begin().next().next().value()).to.equal(2);

        l.splice(l.end(), l.begin());
        expect(l.begin().value()).to.equal(1);
        expect(l.begin().next().value()).to.equal(2);
        expect(l.begin().next().next().value()).to.equal(3);
    });
    it ('can be inserted into correctly', function () {
        var l = new list();

        l.insert(l.begin(), 1);
        expect(l.size()).to.equal(1);
        expect(l.begin().value()).to.equal(1);

        l.insert(l.end(), 2);
        expect(l.size()).to.equal(2);
        expect(l.begin().value()).to.equal(1);
        expect(l.begin().next().value()).to.equal(2);

        l.insert(l.last(), 3);
        expect(l.begin().value()).to.equal(1);
        expect(l.begin().next().value()).to.equal(3);
        expect(l.begin().next().next().value()).to.equal(2);
        expect(l.size()).to.equal(3);

        l.insert(l.begin(), 0);
        expect(l.begin().value()).to.equal(0);
        expect(l.begin().next().value()).to.equal(1);
        expect(l.begin().next().next().value()).to.equal(3);
        expect(l.begin().next().next().next().value()).to.equal(2);
        expect(l.size()).to.equal(4);
    });
});

const nreps = 5e4;
describe('ListPerf: push front ' + nreps, function() {
    var l = new list();
    it ('List: push front ' + nreps, function() {
        var i = 0;
        for (; i < nreps; ++i) {
            l.push_front(i);
        }
    });
    it ('List: can iter and verify', function() {
        expect(l.size()).to.equal(nreps);
        var i = 1;
        var iters = 0;
        for (var v of l) {
            expect(v).to.equal(nreps - i);
            ++i; ++iters;
        }
        expect(iters).to.equal(nreps);
    });
});

describe('ArrayPerf: push front ' + nreps, function() {
    var l = new Array();
    it ('Array: push front ' + nreps, function () {
        var i = 0;
        for (; i < nreps; ++i) {
            l.unshift(i);
        }
    });
    it ('Array: can iter and verify', function() {
        expect(l.length).to.equal(nreps);
        var i = 1;
        var iters = 0;
        for (var v of l) {
            expect(v).to.equal(nreps - i);
            ++i; ++iters;
        }
        expect(iters).to.equal(nreps);
    });
});
