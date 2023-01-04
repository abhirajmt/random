/* eslint-disable prettier/prettier */
/* eslint-disable no-useless-concat */
/* eslint-disable max-statements */
/* eslint-disable complexity */
/* eslint-disable no-extend-native */
// TODO: Move this file into common utils
import uniqBy from 'lodash/uniqBy';

if (!Object.values) {
  Object.values = function (obj) {
    return Object.keys(obj).map(function (key) {
      return obj[key];
    });
  };
}

if (!Array.prototype.subtract) {
  Object.defineProperty(Array.prototype, 'subtract', {
    value: function (arr) {
      return this.filter(val => arr.indexOf(val) === -1);
    },
    enumerable: false,
  });
}

if (!Array.prototype.unique) {
  Object.defineProperty(Array.prototype, 'unique', {
    value: function (cb) {
      return uniqBy(this, cb);
    },
    enumerable: false,
  });
}

if (!Array.prototype.delete) {
  Object.defineProperty(Array.prototype, 'delete', {
    value: function (val) {
      return this.filter(value => value !== val);
    },
    enumerable: false,
  });
}

if (!Array.prototype.intersection) {
  Object.defineProperty(Array.prototype, 'intersection', {
    value: function (arr) {
      return this.filter(val => arr.indexOf(val) > -1);
    },
    enumerable: false,
  });
}

if (!Array.prototype.union) {
  Object.defineProperty(Array.prototype, 'union', {
    value: function (arr = []) {
      return this.concat(arr.filter(item => this.indexOf(item) < 0));
    },
    enumerable: false,
  });
}

if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (search, pos) {
    return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
  };
}
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function (search, this_len) {
    if (this_len === undefined || this_len > this.length) {
      this_len = this.length;
    }
    return this.substring(this_len - search.length, this_len) === search;
  };
}
if (!String.prototype.includes) {
  String.prototype.includes = function (search, start) {
    if (typeof start !== 'number') {
      start = 0;
    }

    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}

if (!Array.prototype.forEach) {
  Object.defineProperty(Array.prototype, 'forEach', {
    value: function (callback, thisArg) {
      thisArg = thisArg || window;
      for (let i = 0; i < this.length; i++) {
        callback.call(thisArg, this[i], i, this);
      }
    },
    enumerable: false,
  });
}

if (!Array.prototype.flatMap) {
  Object.defineProperty(Array.prototype, 'flatMap', {
    value: function (callback, thisArg) {
      var self = thisArg || this;
      if (self === null) {
        throw new TypeError('Array.prototype.flatMap ' + 'called on null or undefined');
      }
      if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
      }
      var list = [],
        o = Object(self);
      var len = o.length >>> 0;
      for (var k = 0; k < len; ++k) {
        if (k in o) {
          var part_list = callback.call(self, o[k], k, o);
          list = list.concat(part_list);
        }
      }
      return list;
    },
    enumerable: false,
  });
}

if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    enumerable: false,
    value: function (searchElement, fromIndex) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      // 1. Let O be ? ToObject(this value).
      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If len is 0, return false.
      if (len === 0) {
        return false;
      }

      // 4. Let n be ? ToInteger(fromIndex).
      //    (If fromIndex is undefined, this step produces the value 0.)
      var n = fromIndex | 0;

      // 5. If n ≥ 0, then
      //  a. Let k be n.
      // 6. Else n < 0,
      //  a. Let k be len + n.
      //  b. If k < 0, let k be 0.
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      function sameValueZero(x, y) {
        return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
      }

      // 7. Repeat, while k < len
      while (k < len) {
        // a. Let elementK be the result of ? Get(O, ! ToString(k)).
        // b. If SameValueZero(searchElement, elementK) is true, return true.
        if (sameValueZero(o[k], searchElement)) {
          return true;
        }
        // c. Increase k by 1.
        k++;
      }

      // 8. Return false
      return false;
    },
  });
}
if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, 'findIndex', {
    enumerable: false,
    value: function (predicate) {
      // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return k.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return k;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return -1.
      return -1;
    },
  });
}
