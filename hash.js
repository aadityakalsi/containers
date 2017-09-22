/*! hash.js */

var Hash = (function () {
    // Used to check objects for own properties
    let _hasOwnProperty = Object.prototype.hasOwnProperty

    // Hashes a string
    let _hash = function(string) {
        let hash = 0;
        string = string.toString();
        let len = string.length;
        for(let i = 0; i < len; i++)  {
            hash = (((hash << 5) - hash) + string.charCodeAt(i)) & 0xFFFFFFFF;
        }
        return hash
    }

    // Deep hashes an object
    let _object = function(obj) {
        if (typeof obj.getTime == 'function') {
            return obj.getTime();
        }
        let result = 0;
        let phash = 0;
        for (let property in obj) {
            if (_hasOwnProperty.call(obj, property)) {
                phash = hash(property + value(obj[property]));
                result = (((hash << 5)-hash) + phash) & 0xFFFFFFFF;
            }
        }
        return result
    }

    let _MAPPER = {
        string: _hash,
        number: _hash,
        boolean: _hash,
        object: _object
        // functions are excluded because they are not representative of the state of an object
        // types 'undefined' or 'null' will have a hash of 0
    };

    let main = function(value) {
        let type = value == undefined ? undefined : typeof value
        // Does a type check on the passed in value and calls the appropriate hash method
        let m = _MAPPER[type];
        return m ? (m(value) + _hash(type)) : 0
    }

    return main;
}());

if (typeof module !== 'undefined') {
    module.exports = Hash;
}
