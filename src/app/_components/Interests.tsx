import { Shapes } from "lucide-react";

export default function Interests() {
    return (
        <div className="w-full py-5 h-fit px-6 border border-neutral-300 rounded-xl bg-slate-50">
            <div className="flex gap-3 items-center mb-5">
                <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                    <Shapes size={18} color="#8B5CF6" />
                </div>
                <h6 className="text-lg font-semibold">Interests</h6>
            </div>

            <div className="flex flex-wrap space-y-3">
                <div className="text-sm font-semibold py-1 px-[10px] bg-white rounded-full">🎬 Movies & Tv Shows</div>
                <div className="text-sm font-semibold py-1 px-[10px] bg-white rounded-full">📚 Books & Reading</div>
                <div className="text-sm font-semibold py-1 px-[10px] bg-white rounded-full">🎨 Art & Design</div>
                <div className="text-sm font-semibold py-1 px-[10px] bg-white rounded-full">🏋️‍♂️ Fitness & Gym</div>
                <div className="text-sm font-semibold py-1 px-[10px] bg-white rounded-full">🤖 Ai & Robotics</div>
            </div>
        </div>
    )
}