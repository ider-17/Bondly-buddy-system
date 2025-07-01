import { ArrowRight, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function RotatingBuddyCard() {
    return (
        <div className='w-1/2 h-fit bg-white py-5 px-6 rounded-lg border border-gray-200 space-y-5'>
            <h6 className='font-medium text-lg'>Таны 2 долоо хоногийн хамтрагч</h6>

            <div>
                <div className='flex justify-between items-center mb-5'>
                    <div className='flex gap-3 items-center'>
                        <Avatar className='w-10 h-10'>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                            <h6 className='text-base font-medium'>Дөлгөөн баяр</h6>
                            <p className='text-neutral-500 text-sm font-normal'>Product Manager</p>
                        </div>
                    </div>

                    <div className='rounded-xl py-1 px-[10px] bg-green-500 text-white text-xs font-medium flex items-center gap-[6px]'><svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="4" cy="4" r="4" fill="white" />
                    </svg>
                        <p>Идэвхтэй</p>
                    </div>
                </div>

                <div className='w-full flex gap-3'>
                    <div className='w-1/2 rounded-lg py-2 px-6 flex gap-2 items-center justify-center bg-blue-500 cursor-pointer hover:bg-blue-600 active:bg-blue-700 select-none'>
                        <Mail color='white' />
                        <p className='text-white'>Надтай холбогдох</p>
                    </div>
                    <div className='w-1/2 border border-neutral-300 rounded-lg py-2 px-6 flex gap-2 items-center justify-center cursor-pointer text-black hover:bg-sky-100 active:bg-black active:text-white select-none'>
                        <p>Цааш үзэх</p>
                    </div>
                </div>
            </div>

            <div>
                <p className='text-sm font-normal text-neutral-500 mb-2'>Энэ долоо хоногийн зорилго:</p>

                <p className="text-sm font-medium">Манай бүтээгдэхүүн хөгжүүлэлтийн төлөвлөгөө ба хэрэглэгчийн санал хүсэлт авах үйл явцтай танилцаарай ☺ ️ ️</p>
            </div>
        </div>
    )
}