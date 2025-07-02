import { AdviceContent } from "@/app/_components/AdviceContent";

export default function Advice() {
  return (
    <div>
      <header className="h-fit header py-3 px-20 flex justify-between bg-white items-center border-b border-neutral-300">
        <div>
          <h1 className="text-base font-medium">Зөвлөмж</h1>
          <p className="text-xs font-medium text-neutral-500">
            Туршлага дээр суурилсан богино зөвлөмжүүд
          </p>
        </div>
      </header>

      <div className="py-3 px-20 bg-slate-100 min-h-screen">
        <AdviceContent />
      </div>
    </div>
  );
}