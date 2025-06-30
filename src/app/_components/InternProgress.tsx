import { Progress } from "@/components/ui/progress";
import { BookOpen, CalendarDays, Mountain, Trophy } from "lucide-react";

export default function InternProgress() {
    return (
        <div className='bg-white py-5 px-6 rounded-xl border border-[#D4D4D4] space-y-5'>
            <div>
                <div className='flex gap-3'>
                    <h6 className='text-lg font-semibold'>Шинэ ажилтны прогресс</h6>
                </div>

                <hr className="mt-5 mb-5"></hr>

                <div>
                    <div className='flex justify-between '>
                        <p className='text-sm font-medium'>Onboarding прогресс</p>
                        <p>5%</p>
                    </div>
                    <Progress className="mt-3" value={5} />
                </div>
            </div>

            <div className='w-full flex gap-5'>
                <div className='w-1/3 bg-white rounded-xl py-5 flex flex-col gap-2 '>
                    <div className='w-8 h-8 bg-indigo-100 rounded-lg flex justify-center items-center'>
                        <CalendarDays size={18} color='#6366F1' />
                    </div>

                    <div className='flex flex-col'>
                        <p className="font-bold">2</p>
                        <p>Идэвхтэй өдрүүд</p>
                    </div>
                </div>

                <div className='w-1/3 bg-white rounded-xl py-5 flex flex-col gap-2 '>
                    <div className='w-8 h-8 bg-green-100 rounded-lg flex justify-center items-center'>
                        <Mountain size={18} color='#22C55E' />
                    </div>

                    <div className='flex flex-col '>
                        <p className="font-bold">1</p>
                        <p>Биелүүлсэн сорилтууд</p>
                    </div>
                </div>

                <div className='w-1/3 bg-white rounded-xl py-5 flex flex-col gap-2'>
                    <div className='w-8 h-8 bg-violet-100 rounded-lg flex justify-center items-center'>
                        <BookOpen size={18} color='#6D28D9' />
                    </div>

                    <div className='flex flex-col'>
                        <p className="font-bold">2</p>
                        <p>Уншсан зөвлөмжүүд</p>
                    </div>
                </div>
            </div>
        </div>
    )
}