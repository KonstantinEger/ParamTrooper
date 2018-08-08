"use strict";
/**
 *  @license MIT License
 *
 *  Copyright (c) 2018 Konstantin E.
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 */
function params(paramArray, sliceStart) {
    if (sliceStart === void 0) { sliceStart = 2; }
    var parameters = putParamsInArray(paramArray);
    for (var aIndex = sliceStart; aIndex < process.argv.length; aIndex++) {
        // console.log("p");
        var arg = process.argv[aIndex];
        for (var pIndex = 0; pIndex < parameters.length; pIndex++) {
            if (parameters[pIndex].flag === arg) {
                if (parameters[pIndex].type === "single") {
                    parameters[pIndex].callback();
                }
                else if (parameters[pIndex].type === "value") {
                    var following = process.argv[aIndex + 1];
                    parameters[pIndex].callback(following);
                }
                else if (parameters[pIndex].type === "chain") {
                    if (parameters[pIndex].chain_len === undefined) {
                        var err = new Error("Chain length must be defined");
                        throw err;
                    }
                    else {
                        // @ts-ignore
                        var chain = process.argv.slice(aIndex + 1, aIndex + 1 + parameters[pIndex].chain_len);
                        parameters[pIndex].callback(chain);
                    }
                }
            }
        }
    }
}
function putParamsInArray(paramArray) {
    var parameters = [];
    for (var i = 0; i < paramArray.length; i++) {
        if (!Array.isArray(paramArray[i].flag)) {
            var p = paramArray[i];
            if (p.type !== "chain") {
                // @ts-ignore
                parameters.push(new Parameter(p.flag, p.type, p.callback));
            }
            else if (p.type === "chain") {
                // @ts-ignore
                parameters.push(new Parameter(p.flag, p.type, p.callback, p.chain_length));
            }
        }
        else {
            var p = paramArray[i];
            for (var x = 0; x < paramArray[i].flag.length; x++) {
                var f = paramArray[i].flag[x];
                if (p.type !== "chain") {
                    // @ts-ignore
                    parameters.push(new Parameter(f, p.type, p.callback));
                }
                else if (p.type === "chain") {
                    // @ts-ignore
                    parameters.push(new Parameter(f, p.type, p.callback, p.chain_length));
                }
            }
        }
    }
    return parameters;
}
var Parameter = /** @class */ (function () {
    function Parameter(flag, type, callback, cl) {
        this.flag = flag;
        this.type = type;
        this.callback = callback;
        if (cl) {
            this.chain_len = cl;
        }
    }
    return Parameter;
}());
module.exports = params;
