import { redirect } from "next/navigation";
import { getActiveStudent } from "@/lib/actions/students";
import { getShopState } from "@/lib/actions/shop";
import { ShopClient } from "@/components/ShopClient";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const student = await getActiveStudent();
  if (!student) redirect("/profiles");

  const state = await getShopState(student.id);

  return (
    <main className="flex-1 p-6 max-w-3xl mx-auto w-full flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-black text-blue-800">Creature Shop</h1>
        <p className="text-sm text-slate-500">Open mystery orbs with your coins to collect creatures!</p>
      </header>
      <ShopClient studentId={student.id} initial={state} />
    </main>
  );
}
