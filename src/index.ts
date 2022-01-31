import { shiftTab } from "./shift-tab";
import { multiline } from "./utils";

export { shiftTab } from "./shift-tab";
export { untag, multiline, buildTemplate } from "./utils";

export const $t = shiftTab;
export const $tm = shiftTab({ indent: "smallest" });

export const $tt = shiftTab({ trim: true });
export const $ttm = shiftTab({ trim: true, indent: "smallest" });

export const $tp = shiftTab({ pad: true });
export const $tpm = shiftTab({ pad: true, indent: "smallest" });

export const $ttp = shiftTab({ pad: true, trim: true });
export const $ttpm = shiftTab({ pad: true, trim: true, indent: "smallest" });

export const $mlt = multiline;
