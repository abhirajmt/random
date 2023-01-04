import load from "load-script2";
import 'es6-promise/auto';

// if (typeof Object.assign !== 'function') {
// Must be writable: true, enumerable: false, configurable: true
Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) { // .length of function is 2
        'use strict';
        if (target === null || target === undefined) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        var to = Object(target);

        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];

            if (nextSource !== null && nextSource !== undefined) {
                for (var nextKey in nextSource) {
                    // Avoid bugs when hasOwnProperty is shadowed
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return to;
    },
    writable: true,
    configurable: true
});
// }

const POLYFILLS = {
    FETCH: "fetch",
    INTERSECTION_OBSERVER: "intersectionObserver"
}
const DEFAULT_POLYFILLS = [POLYFILLS.FETCH]
const availablePolyfills = [
    {
        test: () => !window.fetch,
        name: POLYFILLS.FETCH,
        load: async () => {
            let fetch;
            try {
                fetch = await load("https://cdn.jsdelivr.net/npm/whatwg-fetch@3.4.1/dist/fetch.umd.min.js")
            } catch (err) {
                throw new Error(err);
            }
            return {
                fetch
            };
        }
    },
    // {
    //     test: () => !window.IntersectionObserver,
    //     name: POLYFILLS.INTERSECTION_OBSERVER,
    //     load: async () => {
    //         let IntersectionObserver;
    //         try {
    //             IntersectionObserver = await import(
    //       /* webpackChunkName: "polyfills/intersection-observer" */ "intersection-observer"
    //             );
    //         } catch (err) {
    //             throw new Error(err);
    //         }
    //         return {
    //             IntersectionObserver
    //         };
    //     }
    // },
];

const loadPolyfills = ({ polyfillList = [] } = {}) => {
    polyfillList = polyfillList.reduce((result, polyfill) => {
        if (result.indexOf(polyfill) === -1) result.push(polyfill);
        return result;
    }, DEFAULT_POLYFILLS);
    let polyfillFns = availablePolyfills
        .filter(polyfill => polyfillList.indexOf(polyfill.name) > -1 && polyfill.test())
        .map(polyfill => polyfill.load());
    if (polyfillFns.length) {
        return Promise.all(polyfillFns);
    } else {
        return Promise.resolve();
    }
};

export default loadPolyfills;