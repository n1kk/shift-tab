# shift-tab

String template tag to manage indent in a code block, or any other multiline text. `small`, `zero dependencies`, `es module`, `treeshakable`, `TypeScript`

Features:

- Can be used as template tag for in-place unindenting code blocks
- Can be used as a normal function to dynamically process text in variables or pass to some pipeline as a processor
- Configurable, behavior can be tuned via config parameter
- Uniformal, same function to use as tag, method and a factory. Factory product can also be used as both, a tag or a method.

### Table of Content

- [shift-tab](#shift-tab)
  - [Import](#import)
  - [Usage](#usage)
    - [Whitespace](#whitespace)
- [API and Configuration](#api-and-configuration)
  - [Template tag signature](#template-tag-signature)
  - [Tag factory signature](#tag-factory-signature)
  - [Options](#options)
  - [Exported aliases](#exported-aliases)

### Import:

```ts
import shiftTab from "shift-tab";
// or it's shorter alias
import { $t } from "shift-tab";
```

Some code at some random indentation level:

### Usage:

<!-- prettier-ignore -->
```ts
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

New lines are preserved by default, but can be configured.

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

#### Whitespace

It works with both `tabs` abd `spaces`. The first indent character that is encountered become the indentation character, so be sure not to mix both.

## API and Configuration

### Template tag signature

A tag to use with string templates.

`shiftTab(strings: TemplateStringsArray, ...variables: any[]): string`

```ts
const someCode = shiftTab`
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

const someUntabbedCode = shiftTab(someCode);
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

#### Options:

Signature:

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

### Exported aliases

```ts
const $t = shiftTab;
const $tm = shiftTab({ indent: "smallest" });
const $tt = shiftTab({ trim: true });
const $ttm = shiftTab({ trim: true, indent: "smallest" });
const $tp = shiftTab({ pad: true });
const $tpm = shiftTab({ pad: true, indent: "smallest" });
const $ttp = shiftTab({ pad: true, trim: true });
const $ttpm = shiftTab({ pad: true, trim: true, indent: "smallest" });
```
