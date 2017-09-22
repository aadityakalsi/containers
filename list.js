/*! list.js */
class ListNode {
    constructor(val, prev, next) {
        this._val = val;
        this._prev = prev;
        this._next = next;
    }
    next() {
        return this._next;
    }
    prev() {
        return this._prev;
    }
    value() {
        return this._val;
    }
    set_next(n) {
        this._next = n;
    }
    set_prev(p) {
        this._prev = p;
    }
    unlink() {
        var p = this._prev;
        if (p) {
            p.set_next(this._next);
            this._prev = null;
        }
        if (this._next) {
            this._next.set_prev(p);
            this._next = null;
        }
    }
}

class List {
    constructor() {
        this._first = null;
        this._last = null;
        this._size = 0;
    }
    push_front(val) {
        var n = new ListNode(val, null, this._first);
        if (this._last === null) {
            this._last = n;
        }
        this._first = n;
        ++this._size;
    }
    push_back(val) {
        var n = new ListNode(val, this._last, null);
        if (this._first === null) {
            this._first = n;
        }
        if (this._last) {
            this._last.set_next(n);
        }
        this._last = n;
        ++this._size;
    }
    begin() {
        return this._first;
    }
    end() {
        return null;
    }
    last() {
        return this._last;
    }
    splice(node, new_node) {
        this.unlink_node(new_node);
        this.splice_free(node, new_node);
    }
    splice_free(node, new_node) {
        if (node) {
            new_node.set_next(node);
            var np = node.prev();
            node.set_prev(new_node);
            if (np) {
                np.set_next(new_node);
                new_node.set_prev(np);
            } else {
                this._first = new_node;
            }
        } else {
            new_node.set_prev(this._last);
            if (this._last) {
                this._last.set_next(new_node);
            }
            this._last = new_node;
            if (this._first === null) {
                this._first = new_node;
            }
        }
    }
    insert(before, val) {
        if (before === null) {
            this.push_back(val);
            return;
        }
        var node = new ListNode(val, null, null);
        node.set_next(before);
        if (before.prev()) {
            before.prev().set_next(node);
        } else {
            this._first = node;
        }
        ++this._size;
    }
    erase(node) {
        --this._size;
        this.unlink_node(node);
    }
    size() {
        return this._size;
    }
    [Symbol.iterator]() {
        var l = this;
        var iter = l.begin();
        function next() {
            var curr = iter;
            var val = null;
            var done = true;
            if (curr !== null) {
                iter = iter.next();
                val = curr.value();
                done = false;
            }
            return {
                value: val,
                done: done
            };
        }
        return {
            next: next
        };
    }
    unlink_node(node) {
        if (this._first === node) {
            this._first = node.next();
        }
        if (this._last === node) {
            this._last = node.prev();
        }
        node.unlink();
    }
}

if (typeof module !== 'undefined') {
    module.exports = List;
}
