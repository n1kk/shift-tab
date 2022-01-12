# shift-tab

String template tag to manage indent in a code block, or any other multiline text. `small`, `zero dependencies`, `es module`, `treeshakable`, `TypeScript`

Features:

- Can be used as [template tag](#template-tag-signature) for in-place unindenting code blocks
- Can be used as a [normal function](#string-processor-signature) to dynamically process text in variables or pass to some pipeline as a processor
- Can be used as a [factory](#tag-factory-signature) to create [preconfigured](#configuration-options) tags or methods
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

#### all exported aliases:

```ts
export const $t = shiftTab;
export const $tm = shiftTab({ indent: "smallest" });
export const $tt = shiftTab({ trim: true });
export const $ttm = shiftTab({ trim: true, indent: "smallest" });
export const $tp = shiftTab({ pad: true });
export const $tpm = shiftTab({ pad: true, indent: "smallest" });
export const $ttp = shiftTab({ pad: true, trim: true });
export const $ttpm = shiftTab({ pad: true, trim: true, indent: "smallest" });
```

Use as a tag on a string template:

<!-- prettier-ignore -->
```ts
// some code
    // some code
        // ....
        const someCode = $t`
            <h1>Title</h1>
            <p>
                Lorem ipsum <img src="./img.jpg"/>
            </p>
        `;
        // ....
```

Content of `someCode` now is (empty line included):

```js
`
<h1>Title</h1>
<p>
    Lorem ipsum <img src="./img.jpg"/>
</p>
`;
```

New lines are preserved by default, but can be [configured](#configuration-options).

Calling it as a function and passing configurations object creates a new tag:

```ts
const trim = shiftTab({ trim: true });
// or just import preconfigured shortcut
import { $tt } from "shift-tab";

const someCode = trim`
    <h1>Title</h1>
    <p>
        Lorem ipsum <img src="./img.jpg"/>
    </p>
`;
```

Content of `someCode` now is:

```js
`<h1>Title</h1>
<p>
    Lorem ipsum <img src="./img.jpg"/>
</p>`;
```

See the full list of [configuration options](#configuration-options).

#### Options

#### Whitespace

It works with both `tabs` and `spaces`. The first indent character that is encountered will become the indentation character, so be sure not to mix both.

## API and Configuration

### Template tag signature

A tag to use with string templates.

`shiftTab(strings: TemplateStringsArray, ...variables: any[]): string`

```ts
const someCode = $t`
    <h1>Title</h1>
`;
```

### String processor signature

Works same as template tag but in a regular function form, can be used to for dynamic text processing.

`shiftTab(text: string): string`

```ts
const someCode = `
    <h1>Title</h1>
    <p>Content</p>
`;

const someUntabbedCode = $t(someCode);
```

### Tag factory signature

`shiftTab(config: Options): TemplateTag`

```ts
const untab = shiftTab({ indent: "minimum", pad: true, trim: true });

const someCode = untab`
    <h1>Title</h1>
    <p>Content</p>
`;
/* someCode:
`<h1>Title</h1>
<p>Content</p>`
*/
```

#### Configuration options

```ts
type Options = {
  indent?: "first" | "smallest" | number;
  pad?: boolean | number;
  trim?: boolean;
};
```

- `indent`: How to treat indentation of the lines
  - `"first"` (_default_) : Find first indentation non-empty line and shift all text bu it's indentation
  - `"smallest"`: Get the minimum indentation of all non empty lines and shift text by that amount
  - `number`: a number if whitespace characters to decrease the indent to (or increase to)
- `pad`: How to handle lines trailing whitespace
  - `false` (_default_) : trim it
  - `false`: pad all the lines with whitespace up to a maximum line size (can be usefull if you want to set background color text in the console)
  - `number`: set padding to a specific number of whitespace chars
- `trim`: How to treat empty leading and trailing empty lines
  - `true`: remove
  - `false`: leave
