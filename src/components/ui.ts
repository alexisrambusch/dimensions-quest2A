// Shared style tokens so every manipulative and lesson screen feels like one
// consistent, kid-friendly game rather than a patchwork of ad-hoc styles.

export const BIG_BUTTON =
  "min-h-14 min-w-14 rounded-2xl text-xl font-bold shadow-md active:scale-95 transition-transform select-none touch-manipulation";

export const PRIMARY_BUTTON = `${BIG_BUTTON} bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 disabled:pointer-events-none px-6 py-3`;

export const SECONDARY_BUTTON = `${BIG_BUTTON} bg-white text-blue-700 border-2 border-blue-200 hover:border-blue-400 px-6 py-3`;

export const CHOICE_BUTTON_IDLE = `${BIG_BUTTON} bg-white text-slate-800 border-2 border-slate-200 hover:border-blue-300 px-5 py-3`;
export const CHOICE_BUTTON_SELECTED = `${BIG_BUTTON} bg-blue-100 text-blue-800 border-2 border-blue-500 px-5 py-3`;
export const CHOICE_BUTTON_CORRECT = `${BIG_BUTTON} bg-emerald-100 text-emerald-800 border-2 border-emerald-500 px-5 py-3`;
export const CHOICE_BUTTON_WRONG = `${BIG_BUTTON} bg-rose-100 text-rose-800 border-2 border-rose-400 px-5 py-3`;

export const CARD = "rounded-3xl bg-white shadow-lg border border-slate-100 p-6";
