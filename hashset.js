/*! hashset.js */

/*eslint-disable no-param-reassign */
let list;
let hash;
if (typeof module !== 'undefined') {
    list = require('./list.js');
    hash = require('./hash.js');
} else {
    list = List;
    hash = Hash;
}

class HashSet {
    constructor(h, eq, cap, loadfac, grow) {
        let eq_def = function(x, y) {
            if (typeof x === 'object' && typeof y === 'object') {
                return JSON.stringify(x) === JSON.stringify(y);
            }
            return x === y;
        };
        h = h || hash;
        eq = eq || eq_def;
        cap = cap || 0;
        this._hash = h;
        this._eq = eq;
        this._buckets = [];
        this._list = new list();
        this._loadfac = loadfac || 0.9;
        this._grow = grow || 2.3;
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
        let h = this._hash(key);
        let cap = (this.cap() | 0);
        let hnum = h % cap;
        return hnum < 0 ? hnum + cap : hnum;
    }
    find(key) {
        if (this.size() === 0) return null; 
        let b = this.bucket(key);
        b = this._buckets[b];
        let n = b.num;
        let f = b.first;
        let i = 0;
        let eq = this._eq;
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
        let h = this._hash(key);
        let cap = (this.cap() | 0);
        let bnum = h % cap;
        bnum = bnum < 0 ? bnum + cap : bnum;
        let b = this._buckets[bnum];
        let n = b.num;
        let f = b.first;
        let i = 0;
        let eq = this._eq;
        for (; i < n; ++i) {
            if (eq(f.value(), key)) {
                return;
            }
            f = f.next();
        }
        if ((this.size() + 1) > cap * this._loadfac) {
            this.rehash((cap * this._grow) | 0);
            cap = (this.cap() | 0);
            bnum = h % cap;
            bnum = bnum < 0 ? bnum + cap : bnum;
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
        let n = b.num;
        let f = b.first;
        let i = 0;
        let eq = this._eq;
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
        cap = cap < 25 ? 25 : cap;
        let set = new HashSet(this._hash, this._eq, cap);
        let it = this._list.begin();
        while (it !== null) {
            set.add(it.value());
            it = it.next();
        }
        this._buckets = set._buckets;
        this._list = set._list;
    }
}

if (typeof module !== 'undefined') {
    module.exports = HashSet;
}
