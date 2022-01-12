type TemplateTag = (strings: TemplateStringsArray, ...variables: any[]) => string;
type TemplateTagArgs = [strings: TemplateStringsArray, ...variables: any[]];
type Options = Partial<{
    indent: "first" | "minimum" | number;
    pad: boolean | number;
    trim: boolean;
}>;

export function shiftTab(config: Options): TemplateTag;
export function shiftTab(text: string): string;
export function shiftTab(strings: TemplateStringsArray, ...variables: any[]): string;
///
export function shiftTab(
    this: Options | void,
    ...args: [config: Options] | [text: string] | TemplateTagArgs
): TemplateTag | string {
    if (typeof args[0] === "object" && !Array.isArray(args[0])) {
        return shiftTab.bind(args[0]);
    } else {
        let str: string = typeof args[0] === "string" ? args[0] : buildTemplate(...(args as TemplateTagArgs));
        const { indent = "first", pad, trim } = this ?? ({} as Options);
        let lines = str.split("\n");

        const isEmptyLine = (str: string, indentSize: number) => str === "" || indentSize === str.length;

        let wsChar = "";
        const countIndent = (str: string) => {
            const size = count(str, ch => {
                if (!wsChar && (ch === " " || ch === "\t")) wsChar = ch;
                return ch === wsChar;
            });
            return isEmptyLine(str, size) ? -1 : size;
        };

        const lineIndents = lines.map(countIndent);

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

        if (pad || typeof pad === "number") {
            const padSize = typeof pad === "number" ? pad : Math.max(...lines.map(line => line.length));
            lines = lines.map(line => line.padEnd(padSize, " "));
        } else {
            lines = lines.map(line => line.trimEnd());
        }

        let untabedStr = lines.join("\n");

        if (trim) {
            untabedStr = untabedStr.trim();
        }

        return untabedStr;
    }
}

function buildTemplate(strings: TemplateStringsArray, ...variables: any[]): string {
    return strings
        .map((str, i) => {
            const variable = variables.length > i ? variables?.[i] : "";
            return str + variable;
        })
        .join("");
}

function count<T = any>(target: ArrayLike<T>, test: (value: T, i: number) => boolean, reverse = false): number {
    for (let i = 0; i < target.length; i++) {
        const element = target[reverse ? target.length - (i + 1) : i];
        if (!test(element, i)) return i;
    }
    return target.length;
}

export const $t = shiftTab;
export const $tm = shiftTab({ indent: "minimum" });

export const $tt = shiftTab({ trim: true });
export const $ttm = shiftTab({ trim: true, indent: "minimum" });

export const $tp = shiftTab({ pad: true });
export const $tpm = shiftTab({ pad: true, indent: "minimum" });

export const $ttp = shiftTab({ pad: true, trim: true });
export const $ttpm = shiftTab({ pad: true, trim: true, indent: "minimum" });
