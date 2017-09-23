/*! hash.js */

/*eslint-disable no-param-reassign */
var Hash = (function () {
    // Used to check objects for own properties
    let _hasOwnProperty = Object.prototype.hasOwnProperty;

    // Hashes a string or float
    let _hash = function(data) {
        let hash = 0;
        let len = data.length;
        let i = len;
        while (i)  {
            hash = (((hash << 5) - hash) + data.charCodeAt(--i)) & 0xFFFFFFFF;
        }
        return (((hash << 5) - hash) + len) & 0xFFFFFFFF;
    };

    let _hashflt = function(data) {
        return _hash(data.toString());
    }

    let _hashnum = function(data) {
        if (data === +data && data === (data|0)) {
            return data;
        } else {
            return _hashflt(data);
        }
    };
    
    let _hashbool = (function() {
        var t_hash = _hash("__bool__:true");
        var f_hash = _hash("__bool__:false");
        return function(data) {
            if (data === true) {
                return t_hash;
            } else {
                return f_hash;
            }
        };
    }());

    // Deep hashes an object
    let _object = function(obj) {
        if (typeof obj.getTime === 'function') {
            return obj.getTime();
        }
        let hash = 0;
        let phash = 0;
        for (let property in obj) {
            if (_hasOwnProperty.call(obj, property)) {
            	phash = 0;
                phash += _hash(property);
                phash += _hash(obj[property]);
                hash = (((hash << 5)-hash) + phash) & 0xFFFFFFFF;
            }
        }
        return hash;
    };

    let _MAPPER = {
        string: _hash,
        number: _hashnum,
        boolean: _hashbool,
        object: _object
        // functions are excluded because they are not representative of the state of an object
        // types 'undefined' or 'null' will have a hash of 0
    };

    let main = function(value) {
        // Does a type check on the passed in value and calls the appropriate hash method
        // let m = _MAPPER[typeof value];
        // return m ? m(value) + _hash(type) : 0;
        if (value === undefined) {
            return 0;
        }
        return _MAPPER[typeof value](value);
    };

    return main;
}());

if (typeof module !== 'undefined') {
    module.exports = Hash;
}
