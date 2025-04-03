// entrypoint.js

// Import required polyfills first
// IMPORTANT: These polyfills must be installed in this order
import "fast-text-encoding";
import "react-native-get-random-values";
import "@ethersproject/shims";
import "text-encoding-polyfill";
// Then import the expo router
import "expo-router/entry";

if (typeof global.TextDecoder !== "undefined") {
    const OriginalTextDecoder = global.TextDecoder;
    global.TextDecoder = function (encoding, options) {
        // Ignore the 'fatal' option
        const safeOptions = options ? { ...options, fatal: undefined } : options;
        return new OriginalTextDecoder(encoding, safeOptions);
    };
}
