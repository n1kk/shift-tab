import type { Processor, TemplateTag } from "./shift-tab";

export function buildTemplate(strings: TemplateStringsArray, ...variables: any[]): string {
    return strings
        .map((str, i) => {
            const variable = variables.length > i ? variables?.[i] : "";
            return str + variable;
        })
        .join("");
}

export function count<T = any>(target: ArrayLike<T>, test: (value: T, i: number) => boolean, reverse = false): number {
    for (let i = 0; i < target.length; i++) {
        const element = target[reverse ? target.length - (i + 1) : i];
        if (!test(element, i)) return i;
    }
    return target.length;
}

export function untag(tag: TemplateTag): Processor {
    return (input: string) => {
        const templateStrings = [input] as unknown as TemplateStringsArray;
        (templateStrings as any).raw = templateStrings;
        return tag(templateStrings);
    };
}

export function isEmptyOrWhitespace(str: string | undefined) {
    return str === "" || (typeof str === "string" && /^\s+$/.test(str));
}

export function multiline(...lines: string[] | [string[]]): string {
    return Array.isArray(lines[0]) ? lines[0].join("\n") : lines.join("\n");
}
