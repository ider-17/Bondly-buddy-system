import { ArrowRight, Handshake, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function InternYouGuiding() {
    return (
        <div className='bg-slate-50 py-5 px-6 rounded-xl border border-[#D4D4D4] space-y-5'>
            <div className='flex gap-3 items-center'>
                <div className='w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center'>
                    <Handshake size={20} color='#F97316' />
                </div>
                <h6 className='font-semibold text-lg'>Intern You’re Guiding</h6>
            </div>

            <div className='bg-orange-50 rounded-lg p-3'>
                <h6 className='text-orange-700'>Follow your intern’s journey - track progress, give feedback, and help them grow.</h6>
            </div>

            <div>
                <div className='flex justify-between items-center mb-4'>
                    <div className='flex gap-2 items-center'>
                        <Avatar className='w-10 h-10'>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                            <h6 className='text-base font-medium'>Togtuun</h6>
                            <p className='text-[#525252] text-sm font-medium'>UX/UI Designer</p>
                        </div>
                    </div>

                    <div className='rounded-xl py-1 px-[10px] bg-green-100 text-green-500 text-xs font-medium flex items-center gap-[6px]'><svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="4" cy="4" r="4" fill="#22C55E" />
                    </svg>
                        <p>Online</p>
                    </div>
                </div>

                <div className='w-full flex gap-3'>
                    <div className='w-1/2 rounded-lg py-2 px-6 flex gap-2 items-center justify-center bg-blue-500'>
                        <Mail color='white' />
                        <p className='text-white'>Contact me</p>
                    </div>
                    <div className='w-1/2 border border-neutral-300 rounded-lg py-2 px-6 flex gap-2 items-center justify-center'>
                        <p>See more </p>
                        <ArrowRight size={20} color='black' />
                    </div>
                </div>
            </div>

            <hr />

            <div>
                <div className='flex justify-between items-center mb-3'>
                    <p className='text-sm font-medium text-neutral-600'>This week’s micro-goal:</p>

                    <div className='rounded-full py-1 px-[10px] bg-orange-100 text-orange-500 text-xs font-medium flex items-center gap-[6px]'>
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="4" cy="4" r="4" fill="#F97316" />
                        </svg>
                        <p>In Progress</p>
                    </div>
                </div>

                <p>Intern-тэйгээ 1:1 уулзалт товлоорой 🙌 ️</p>
            </div>
        </div>
    )
}