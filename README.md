# shift-tab

String template tag to manage indent in a multiline text block and some more. Use custom processors to create your own powerful loggers, stylers and formatters.

Works with both `tabs` and `spaces`. The first indent character that is encountered will become the indentation character, a mix won't work.

## Usage

Install:

```bash
npm install shift-tab
yarn add shift-tab
pnpm add shift-tab
```

Import:

```ts
import shiftTab from "shift-tab";
// or it's shorter alias
import { $t } from "shift-tab"; // see all aliases at the bottom
```

Simple usage:

<!-- prettier-ignore -->
```ts
// some indented code
    // some indented code
        // ....
        if (error) {
            console.error($t`
                An error has occured:
                    code: ${error.code}
                    message: ${error.message}
            `);
        }
```

This will output following

```
An error has occured:
    code: ${error.code}
    message: ${error.message}
```

Adding preprocessors:

```ts
import chalkTemplate from "chalk-template";
import shiftTab, { untag } from "./dist/index.js";

const print = shiftTab({ process: [untag(chalkTemplate), console.log] });
```

Now we have a neat little logger that will output unindented, trimmed multiline text with colorization support

<!-- prettier-ignore -->
```ts
// ...
    if (error) {
        print`
            {red An error has occurred}:
              code: {blue ${error.code}}
              message: {yellowBright ${error.message}}
        `;
    }
```

That will print a trimmed and colored message:

![Screen1](https://github.com/n1kk/shift-tab/raw/master/test/screen1.png)

## API and Configuration

TypeScript signatures:

```ts
// to use as a template tag
function shiftTab(strings: TemplateStringsArray, ...variables: any[]): string;
// to use as a regualr function
function shiftTab(text: string): string;
// to use as a factory
function shiftTab(config: Options): TemplateTag; // retured function can be used as previous two
```

Aliases:

```ts
const $t = shiftTab;
const $tm = shiftTab({ indent: "smallest" });
const $tt = shiftTab({ trim: "lines" });
const $ttm = shiftTab({ trim: "lines", indent: "smallest" });
```

#### Configuration options

```ts
type Options = {
  indent?: "first" | "smallest" | "all" | number;
  trim?: "wrap" | "lines" | "none";
  process?: Processor[];
};
```

- `indent`: How to treat indentation of the lines, default `"first"`
  - `"first"`: Find first indentation non-empty line and shift all text bu it's indentation
  - `"smallest"`: Get the minimum indentation of all non empty lines and shift text by that amount
  - `"all"`: Remove all indentation
  - `number`: a number if whitespace characters to decrease the indent to (or increase to)
- `trim`: How to treat leading and trailing empty lines, default `"wrap"`
  - `"wrap"`: remove only wrap lines of multiline template tag (first and last), if first line is empty and last line is a whitespace
  - `"lines"`: remove all leading and trailing epty and whitespace lines
  - `"none"`: preserve all lines
- `process`: an array of methods to pipe the output through before returning, should accept string, return string value replaces text, other return types are ignored

### Untag

Takes a template tag and return function that accepts string and return string

```ts
function untag(tag: TemplateTag): Processor;

type Processor = (input: string) => string | any;
```
