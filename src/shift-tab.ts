import { buildTemplate, count, isEmptyOrWhitespace } from "./utils.js";

export type TemplateTag = (strings: TemplateStringsArray, ...variables: any[]) => string;
export type TemplateTagArgs = [strings: TemplateStringsArray, ...variables: any[]];

type Options = {
    indent?: "first" | "smallest" | "all" | number;
    pad?: boolean | number;
    trim?: "wrap" | "lines" | "none";
    process?: Processor[];
};

export type Processor = (input: string) => any;

export function shiftTab(config: Options): TemplateTag;
export function shiftTab(text: string): string;
export function shiftTab(strings: TemplateStringsArray, ...variables: any[]): string;
export function shiftTab(
    this: Options | void,
    ...args: [config: Options] | [text: string] | TemplateTagArgs
): TemplateTag | string {
    if (typeof args[0] === "object" && !Array.isArray(args[0])) {
        return shiftTab.bind(args[0]);
    } else {
        let str: string = typeof args[0] === "string" ? args[0] : buildTemplate(...(args as TemplateTagArgs));
        const { indent = "first", pad, trim = "wrap", process } = this ?? ({} as Options);
        let lines = str.split("\n");

        let wsChar = "";
        const countIndent = (str: string) => {
            if (str === "") {
                return -1;
            }
            const size = count(str, ch => {
                if (!wsChar && (ch === " " || ch === "\t")) {
                    wsChar = ch;
                }
                return ch === wsChar;
            });
            return size;
        };

        let lineIndents = lines.map(countIndent);

        if (trim === "lines") {
            const leading = count(lines, isEmptyOrWhitespace);
            const trailing = count(lines, isEmptyOrWhitespace, true);
            lines = lines.slice(leading, -trailing || undefined);
            lineIndents = lineIndents.slice(leading, -trailing);
        } else if (trim === "wrap") {
            if (lines[0] === "") {
                lines.shift();
                lineIndents.shift();
            }
            if (isEmptyOrWhitespace(lines[lines.length - 1])) {
                lines.pop();
                lineIndents.pop();
            }
        }

        if (indent === "all") {
            lines = lines.map((line, i) => line.substring(lineIndents[i]));
        } else {
            let indentSize =
                indent === "first"
                    ? lineIndents.find(_ => _ > -1) //
                    : Math.min(...lineIndents.filter(_ => _ !== -1));

            if (indentSize !== undefined && indentSize > 0) {
                const size = indentSize;
                lines = lines.map((line, i) => line.substring(Math.min(size, lineIndents[i])));
            }

            if (typeof indent === "number") {
                const pad = wsChar.repeat(indent);
                lines = lines.map(line => pad + line);
            }
        }

        let result = lines.join("\n");

        if (process) {
            result = process.reduce((acc, processor) => {
                const processed = processor(acc);
                return typeof processed === "string" ? processed : acc;
            }, result);
        }

        return result;
    }
}
