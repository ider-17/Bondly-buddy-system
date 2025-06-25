import { ArrowRight, BookOpen, ChevronRight, Sparkles } from "lucide-react";

export default function LatestAdvice() {
    return (
        <div className='rounded-xl border border-neutral-300 py-5 px-6 space-y-7 bg-slate-50'>
            <div className='flex items-center justify-between'>
                <div className="flex gap-3 items-center">
                    <div className='w-8 h-8 bg-violet-100 rounded-lg flex justify-center items-center'>
                        <BookOpen size={18} color='#6D28D9' />
                    </div>
                    <h6 className='text-lg font-semibold'>Latest Advice</h6>
                </div>

                <div className="border border-neutral-300 py-2 px-3 flex gap-2 rounded-lg bg-white text-black select-none cursor-pointer hover:bg-sky-100 active:bg-black active:text-white">
                    <p>View all</p>
                    <ArrowRight size={22} />
                </div>
            </div>

            <div>
                <hr />

                <div className="py-[10px] flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                        <div className='w-8 h-8 bg-violet-100 rounded-lg flex justify-center items-center'>
                            <Sparkles size={18} color='#6D28D9' />
                        </div>
                        <p className="text-sm font-medium">Дизайнеруудтай урт хугацааны хамтын ажиллагаа байгуулах🤝</p>
                    </div>

                    <ChevronRight size={22} color="black" />
                </div>
            </div>
            <div>
                <hr />

                <div className="py-[10px] flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                        <div className='w-8 h-8 bg-violet-100 rounded-lg flex justify-center items-center'>
                            <Sparkles size={18} color='#6D28D9' />
                        </div>
                        <p className="text-sm font-medium">Төлөвлөгөөтэй, тууштай хичээх нь амжилтын үндэс💡</p>
                    </div>

                    <ChevronRight size={22} color="black" />
                </div>
            </div>
            <div>
                <hr />

                <div className="py-[10px] flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                        <div className='w-8 h-8 bg-violet-100 rounded-lg flex justify-center items-center'>
                            <Sparkles size={18} color='#6D28D9' />
                        </div>
                        <p className="text-sm font-medium">Өөртөө зориулсан цаг бол залхуурал биш, хөрөнгө оруулалт💡</p>
                    </div>

                    <ChevronRight size={22} color="black" />
                </div>
            </div>
        </div>
    )
}