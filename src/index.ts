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
function params(paramArray: IParameter[], sliceStart = 2) {
    const parameters = putParamsInArray(paramArray);
    for (let aIndex = sliceStart; aIndex < process.argv.length; aIndex++) {
        // console.log("p");
        const arg = process.argv[aIndex];
        for (let pIndex = 0; pIndex < parameters.length; pIndex++) {
            if (parameters[pIndex].flag === arg) {
                if (parameters[pIndex].type === "single") {
                    parameters[pIndex].callback();
                } else if (parameters[pIndex].type === "value") {
                    const following = process.argv[aIndex + 1]; 
                    parameters[pIndex].callback(following);
                } else if (parameters[pIndex].type === "chain") {
                    if (parameters[pIndex].chain_len === undefined) {
                        const err = new Error("Chain length must be defined");
                        throw err;
                    } else {
                        // @ts-ignore
                        const chain = process.argv.slice(aIndex + 1, aIndex + 1 + parameters[pIndex].chain_len);
                        parameters[pIndex].callback(chain);
                    }
                }
            }
        }
    }
}

function putParamsInArray(paramArray: IParameter[]): Parameter[] {
    const parameters: Parameter[] = [];

    for (let i = 0; i < paramArray.length; i++) {
        if (!Array.isArray(paramArray[i].flag)) {
            const p = paramArray[i];
            if (p.type !== "chain") {
                // @ts-ignore
                parameters.push(new Parameter(p.flag, p.type, p.callback));
            } else if (p.type === "chain") {
                // @ts-ignore
                parameters.push(new Parameter(p.flag, p.type, p.callback, p.chain_length));
            }
        } else {
            const p = paramArray[i];
            for (let x = 0; x < paramArray[i].flag.length; x++) {
                const f = paramArray[i].flag[x];
                if (p.type !== "chain") {
                    // @ts-ignore
                    parameters.push(new Parameter(f, p.type, p.callback));
                } else if (p.type === "chain") {
                    // @ts-ignore
                    parameters.push(new Parameter(f, p.type, p.callback, p.chain_length));
                } 
            }
        }
    }

    return parameters;
}

class Parameter {
    flag: string;
    type: "single" | "value" | "chain";
    callback: (value?: string | string[]) => void;
    chain_len?: number;

    constructor(flag: string, type: "single" | "value" | "chain", callback: (value?: string | string[]) => void, cl?: number) {
        this.flag = flag;
        this.type = type;
        this.callback = callback;
        if (cl) {
            this.chain_len = cl;
        }
    }
}

interface IParameter {
    /**
     * Parameter Flag
     */
    flag: string |string[],
    /**
     * Callback is executed if flag is found
     */
    callback: (value?: string | string[]) => void;
    /**
     * - "single": Callback is executed with no value
     * - "value": value following the flag is given to the callback
     * - "chain": given number of values (chain_length) is given to the callback
     */
    type: "single" | "value" | "chain";
    /**
     * Number of values associated with a chain and given to the callback.
     */
    chain_length?: number;
}

export = params;
