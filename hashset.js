/*! hashset.js */

/*eslint-disable no-param-reassign */
var list;
var hash;
if (typeof module !== 'undefined') {
    list = require('./list.js');
    hash = require('./hash.js');
} else {
    list = List;
    hash = Hash;
}
var assert = require('assert');

class HashSet {
    constructor(h, eq, cap) {
        var eq_def = function(x, y) { return x === y; };
        h = h || hash;
        eq = eq || eq_def;
        cap = cap || 0;
        this._hash = h;
        this._eq = eq;
        this._buckets = [];
        this._list = new list();
        for (let i = 0; i < cap; ++i) {
            this._buckets[i] = {
                num: 0,
                first: null
            };
        }
    }
    cap() {
        return this._buckets.length;
    }
    size() {
        return this._list.size();
    }
    bucket(key) {
        var h = this._hash(key);
        let hnum = h % this._buckets.length;
        return hnum < 0 ? hnum + this._buckets.length : hnum;
    }
    find(key) {
        if (this.size() === 0) return null; 
        let b = this.bucket(key);
        b = this._buckets[b];
        var n = b.num;
        var f = b.first;
        let i = 0;
        var eq = this._eq;
        for (; i < n; ++i) {
            if (eq(f.value(), key)) {
                return f;
            }
            f = f.next();
        }
        return null;
    }
    contains(key) {
        return this.find(key) !== null;
    }
    add(key) {
        if (this.cap() === 0) {
            this.rehash(8);
        }
        var h = this._hash(key);
        let bnum = h % this._buckets.length;
        bnum = bnum < 0 ? bnum + this._buckets.length : bnum;
        let b = this._buckets[bnum];
        var n = b.num;
        var f = b.first;
        let i = 0;
        var eq = this._eq;
        for (; i < n; ++i) {
            if (eq(f.value(), key)) {
                return;
            }
            f = f.next();
        }
        if ((this.size() + 1) > this._buckets.length * 0.75) {
            this.rehash(this._buckets.length * 2);
            bnum = h % this._buckets.length;
            bnum = bnum < 0 ? bnum + this._buckets.length : bnum;
            b = this._buckets[bnum];
        }
        this._list.push_back(key);
        let last = this._list.last();
        this._list.splice(b.first, last);
        b.first = last;
        b.num++;
    }
    erase(key) {
        if (this.size() === 0) return false; 
        let bnum = this.bucket(key);
        let b = this._buckets[bnum];
        var n = b.num;
        var f = b.first;
        let i = 0;
        var eq = this._eq;
        for (; i < n; ++i) {
            if (eq(f.value(), key)) {
                if (--b.num === 0) {
                    b.first = null;
                } else  if (b.first === f) {
                    b.first = f.next();
                }
                this._list.erase(f);
                return true;
            }
            f = f.next();
        }
        return false;
    }
    rehash(cap) {
        cap = cap < 8 ? 8 : cap;
        var set = new HashSet(this._hash, this._eq, cap);
        for (let x of this._list) {
            set.add(x);
        }
        this._buckets = set._buckets;
        this._list = set._list;
    }
}

if (typeof module !== 'undefined') {
    module.exports = HashSet;
}
