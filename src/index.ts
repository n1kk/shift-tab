import { shiftTab } from "./shift-tab.js";
import { multiline } from "./utils.js";

export { shiftTab } from "./shift-tab.js";
export { untag, multiline, buildTemplate } from "./utils.js";

export const $t = shiftTab;
export const $tm = shiftTab({ indent: "smallest" });

export const $tt = shiftTab({ trim: "lines" });
export const $ttm = shiftTab({ trim: "lines", indent: "smallest" });

export const $mlt = multiline;
