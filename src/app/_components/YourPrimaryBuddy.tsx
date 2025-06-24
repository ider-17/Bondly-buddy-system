import { HeartHandshake } from "lucide-react";

export default function () {
    return (
        <div className="w-full border border-neutral-300 py-5 px-6 bg-slate-50 rounded-xl">
            <div className="flex gap-3 items-center mb-5">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <HeartHandshake size={18} color="#6366F1" />
                </div>

                <h3 className="text-2xl font-semibold">Your Primary Buddy</h3>
            </div>

            <p className="text-neutral-600 text-sm font-medium">Таны onboarding үйл явцын туршид тогтмол дэмжин тусалж хамт байх таны зөвлөх ментор.</p>
        </div>
    )
}