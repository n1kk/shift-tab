# shift-tab

String template tag to manage indent in a text block and more. Use custom processors to create your own powerful loggers, stylers and formatters.

Features:

- As a [template tag](#template-tag-signature) for in-place unindenting and processing of text blocks
- As a [normal function](#string-processor-signature) to dynamically process text in variables or pass to some pipeline as a processor
- As a [factory](#tag-factory-signature) to create [preconfigured](#configuration-options) tags or methods
- Uniformal, same function to use as tag, method and a factory. Factory product can also be used as both, a tag or a method.

### Usage:

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
import { $t } from "shift-tab";
```

Use as a tag on a string template:

<!-- prettier-ignore -->
```ts
// some code
    // some code
        // ....
        if (error) {
            console.error($t`
                An error has occured:
                    code: ${error.code}
                    message: ${error.message}
            `);
        }
        // ....
```

This will output following

```

An error has occured:
    code: ${error.code}
    message: ${error.message}

```

By default, it only unindents and remove whitespace padding on each line. But you can also configure it to behave differently and pass some processors to pass output to before returning. If you want to pass another template tag it must be unwrapped first with supplied `untag` utility.

```ts
import chalkTemplate from "chalk-template";
import shiftTab, { untag } from "./dist/index.js";

const print = shiftTab({ trim: true, process: [untag(chalkTemplate), console.log] });
```

Now we have a neat little logger that will output unindented, trimmed multiline text with colorization support

<!-- prettier-ignore -->
```ts
// ...
    if (error) {
        print`
            {red An error has occurred}:
              code: {red ${error.code}}
              message: {yellow ${error.message}}
        `;
    }
```

![Screen1](docs/scrn1.png)

See the full list of [configuration options](#configuration-options).

#### Whitespace

It works with both `tabs` and `spaces`. The first indent character that is encountered will become the indentation character, so be sure not to mix both.

## API and Configuration

TypeScript signatures:

```ts
// to use as a template tag
function shiftTab(strings: TemplateStringsArray, ...variables: any[]): string;
// to use as a regualr function
function shiftTab(text: string): string;
// to use as a factory
function shiftTab(config: Options): TemplateTag;
```

#### Configuration options

```ts
type Options = {
  indent?: "first" | "smallest" | "all" | number;
  pad?: boolean | number;
  trim?: boolean;
  process?: Processor[];
};
```

- `indent`: How to treat indentation of the lines
  - `"first"` (_default_) : Find first indentation non-empty line and shift all text bu it's indentation
  - `"smallest"`: Get the minimum indentation of all non empty lines and shift text by that amount
  - `"all"`: Remove all indentation
  - `number`: a number if whitespace characters to decrease the indent to (or increase to)
- `pad`: How to handle lines trailing whitespace
  - `false` (_default_) : trim it
  - `false`: pad all the lines with whitespace up to a maximum line size (can be usefull if you want to set background color text in the console)
  - `number`: set padding to a specific number of whitespace chars
- `trim`: How to treat empty leading and trailing empty lines
  - `true`: remove
  - `false`: leave
- `process`: an array of methods to pipe the output through before returning, should accept string and return string

### Untag

Takes a template tag and return function that accepts string and return string

```ts
function untag(tag: TemplateTag): Processor;

type Processor = (input: string) => string;
```
