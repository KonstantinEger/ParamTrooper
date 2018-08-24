# ParamTrooper
_Easy CLI Parameter Parsing_

## Getting Started
### 1. Install via npm
````bash
$ npm install paramtrooper
````
### 2. Create a cli.js file and require ParamTrooper
````javascript
const ParamTrooper = require('paramtrooper');
````
With requiring ParamTrooper you get a function you can call. Passed to that function is an array of flag-objects and the starting point of your flags. If the starting point is 2: `node cli.js *here* --version`. A flag-object requires 3 properties and has 1 semi-optional one. These properties are:
````ts
{
  /**
   * A string or an array of strings. When the command contains this flag, the callback is
   * called.
   */
  flag: string || string[],

  /**
   * String wich can be "single", "value" or "chain". Read more about the types at "Types
   * of Flags".
   */
  type: string,

  /**
   * Function wich may take an argument dependent on the type of flag and is called when
   * the command contains this flag.
   */
  callback: (values: string || string[]) => void,

  /**
   * Only required when the type is "chain". For the given length the following values are
   * passed to the callback in an array.
   * Read more about the chain at "Types of Flags".
   */
  chain_length?: number
}
````
### 3. Add Flags to your CLI
````js
const ParamTrooper = require('paramtrooper');

ParamTrooper(/*Flags*/[
    {
        flag: "--port",
        type: "value",
        callback: (_port) => {
            console.log(`Server listening on port ${_port}`);
        }
    }
], 2); // Flags start at index two. Not required
````
### 4. Test it out
````bash
$ node cli.js --port 8080
> Server listening on port 8080
````
***
## Types of Flags
- ### Single
With the _`single`_ flag the given callback is called with no value passed to it. Imagine it like an event wich is emitted when the command contains the flag.
> Example
````js
ParamTrooper([
    {
        flag: "--version",
        type: "single",
        callback: () => console.log('v1.0.0');
    }
], 2);
````
````bash
$ node cli.js --version
> v1.0.0
````
- ### Value
With a _`value`_ flag the callback is getting called and the following value is passed to it.
> Example
````js
ParamTrooper([
    {
        flag: "--port",
        type: "value",
        callback: (_port) => {
            console.log(`Server listening on port ${_port}`);
        }
    }
], 2);
````
````bash
$ node cli.js --port 8080
> Server listening on port 8080
````
- ### Chain
With the _`chain`_ flag, the object needs another argument called the chain_length. For the given length in the chain_length the following values are passed to the callback in an array.
> Example
````js
ParamTrooper([
    {
        flag: "new",
        type: "chain",
        chain_length: 2
        callback: (values) => console.log(values);
    }
], 2);
````
````bash
$ node cli.js new pet dog
> ["pet", "dog"]
````
***
## Multiple Flags, Same Thing
If you want multiple flags to do the same thing, you can pass the flag as an array.
> Example
````js
ParamTrooper([
    {
        flag: ["-v", "--version"],
        type: "single",
        callback: () => console.log("v1.0.0");
    }
], 2);
````
````bash
$ node cli.js -v
> v1.0.0
````
_or_
````bash
$ node cli.js --version
> v1.0.0
````
# License
Available under the MIT License.

More abot the license [here](https://github.com/KonstantinEger/ParamTrooper/blob/master/LICENSE).
