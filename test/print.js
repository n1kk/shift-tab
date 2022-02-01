import { shiftTab, untag } from "../dist/index.js";
import chalkTemplate from "chalk-template";

const print = shiftTab({ indent: 1, process: [untag(chalkTemplate), console.log] });

function printError(error) {
    if (error) {
        print`
            {red An error has occurred}:
              code: {blue ${error.code}}
              message: {yellowBright ${error.message}}
        `;
    }
}

printError({ code: 402, message: "Something bad happened" });
