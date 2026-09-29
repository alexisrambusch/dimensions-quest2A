"use client";

interface Props {
  whole: number;
  known: number;
  hidden: "part1" | "part2";
  value: number | undefined;
  onChange: (n: number) => void;
}

/** Classic number-bond diagram: whole on top, two parts below, one part unknown. */
export function NumberBond({ whole, known, hidden, value, onChange }: Props) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col items-center">
        <div className="h-16 w-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-black shadow-md">
          {whole}
        </div>
        <svg width="160" height="50" className="-mt-1">
          <line x1="80" y1="0" x2="20" y2="50" stroke="#60a5fa" strokeWidth="3" />
          <line x1="80" y1="0" x2="140" y2="50" stroke="#60a5fa" strokeWidth="3" />
        </svg>
      </div>
      <div className="flex gap-10 -mt-6">
        <div className="h-14 w-14 rounded-full bg-amber-400 text-white flex items-center justify-center text-xl font-black shadow-md">
          {hidden === "part1" ? "?" : known}
        </div>
        <div className="h-14 w-14 rounded-full bg-sky-400 text-white flex items-center justify-center text-xl font-black shadow-md">
          {hidden === "part2" ? "?" : known}
        </div>
      </div>
      <input
        type="number"
        inputMode="numeric"
        value={value ?? ""}
        onChange={(e) => onChange(Number(e.target.value))}
        placeholder="?"
        className="w-28 text-center text-2xl font-bold rounded-xl border-2 border-slate-300 focus:border-blue-500 outline-none py-2"
      />
    </div>
  );
}
