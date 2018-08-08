const ParamTrooper = require('../dist');

ParamTrooper([
    {
        flag: ["-l", "--log"],
        type: "single",
        callback: () => console.log("Hello World"),
    },
    {
        flag: "new",
        type: "chain",
        chain_length: 2,
        callback: (values) => console.log(values)
    },
    {
        flag: ["-p", "--port"],
        type: "value",
        callback: (port) => console.log(port),
    }
]);