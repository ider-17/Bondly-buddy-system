import { ArrowRight, Handshake, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function InternYouGuiding() {
    return (
        <div className='bg-white py-5 px-6 rounded-xl border border-slate-200 space-y-5'>
            <div className='flex gap-3 items-center'>
                <h6 className='font-medium text-xl'>Таны чиглүүлж буй шинэ ажилтан</h6>
            </div>

            <hr className="mt-5 mb-5"></hr>

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

                    <div className='rounded-xl py-1 px-[10px] bg-green-400 text-xs font-medium flex items-center gap-[6px]'><svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="4" cy="4" r="4" fill="#ffffff" />
                    </svg>
                        <p className="text-white">Идэвхтэй</p>
                    </div>
                </div>

                <div className='w-full flex gap-3'>
                    <div className='w-1/2 rounded-lg py-2 px-6 flex gap-2 items-center justify-center bg-blue-500 cursor-pointer hover:bg-blue-600 active:bg-blue-700 select-none'>
                        <Mail color='white' />
                        <p className='text-white'>Надтай холбогдох</p>
                    </div>
                    <div className='w-1/2 border border-neutral-300 rounded-lg py-2 px-6 flex gap-2 items-center justify-center cursor-pointer hover:bg-sky-100 active:bg-black active:text-white select-none'>
                        <p>Цааш үзэх </p>
                        <ArrowRight size={20} color='black' />
                    </div>
                </div>
            </div>

            <div>
                <div className='flex justify-between items-center mb-3'>
                    <p className='text-sm font-medium text-neutral-600'>Энэ долоо хоногийн зорилго:</p>
                </div>

                <p>Шинэ ажилтантайгаа 1:1 уулзалт товлоорой 🙌</p>
            </div>
        </div>
    )
}