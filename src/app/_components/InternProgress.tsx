import { Progress } from "@/components/ui/progress";
import { BookOpen, CalendarDays, Mountain, Trophy } from "lucide-react";

export default function InternProgress() {
    return (
        <div className='bg-slate-50 py-5 px-6 rounded-xl border border-[#D4D4D4] space-y-5'>
            <div>
                <div className='flex gap-3'>
                    <div className='w-8 h-8 bg-amber-100 rounded-lg flex justify-center items-center'>
                        <Trophy size={20} color='#F59E0B' />
                    </div>
                    <h6 className='text-lg font-semibold'>Intern Progress</h6>
                </div>

                <div>
                    <div className='flex justify-between mb-5'>
                        <p className='text-sm font-medium'>Onboarding Progress</p>
                        <p>5%</p>
                    </div>
                    <Progress value={5} />
                </div>
            </div>

            <div className='w-full flex gap-5 justify-between'>
                <div className='w-1/3 bg-white rounded-xl py-5 flex flex-col gap-2 items-center'>
                    <div className='w-8 h-8 bg-indigo-100 rounded-lg flex justify-center items-center'>
                        <CalendarDays size={18} color='#6366F1' />
                    </div>

                    <div className='flex flex-col items-center text-center'>
                        <p>2</p>
                        <p>Days Active</p>
                    </div>
                </div>

                <div className='w-1/3 bg-white rounded-xl py-5 flex flex-col gap-2 items-center'>
                    <div className='w-8 h-8 bg-green-100 rounded-lg flex justify-center items-center'>
                        <Mountain size={18} color='#22C55E' />
                    </div>

                    <div className='flex flex-col items-center text-center'>
                        <p>1</p>
                        <p>Challenges Done</p>
                    </div>
                </div>

                <div className='w-1/3 bg-white rounded-xl py-5 flex flex-col gap-2 items-center'>
                    <div className='w-8 h-8 bg-violet-100 rounded-lg flex justify-center items-center'>
                        <BookOpen size={18} color='#6D28D9' />
                    </div>

                    <div className='flex flex-col items-center text-center'>
                        <p>2</p>
                        <p>Tips Read</p>
                    </div>
                </div>
            </div>
        </div>
    )
}