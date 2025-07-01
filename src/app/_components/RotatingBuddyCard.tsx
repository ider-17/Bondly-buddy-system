import { Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

export default function RotatingBuddyCard() {
    const [isLoading, setIsLoading] = useState(true);

    // Simulate loading delay
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className='w-full bg-white py-5 px-6 rounded-lg border border-gray-200 space-y-5'>
                {/* Title skeleton */}
                <Skeleton className="h-7 w-48" />

                <div>
                    {/* User info skeleton */}
                    <div className='flex justify-between items-center'>
                        <div className='flex gap-3 items-center'>
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </div>
                        <Skeleton className="h-6 w-16 rounded-xl" />
                    </div>

                    {/* Buttons skeleton */}
                    <div className='w-full flex gap-3'>
                        <Skeleton className="w-1/2 h-10 rounded-lg" />
                        <Skeleton className="w-1/2 h-10 rounded-lg" />
                    </div>
                </div>

                {/* Goal section skeleton */}
                <div>
                    <Skeleton className="h-4 w-40 mb-2" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='w-full h-fit bg-white rounded-lg border border-gray-200 space-y-5'>
            <h6 className='font-semibold text-lg py-5 px-6 mb-0'>Таны 2 долоо хоногийн хамтрагч</h6>

            <hr />

            <div className="pb-5 px-6">
                <div>
                    <div className='flex justify-between items-center mb-3'>
                        <div className="w-full flex justify-between">
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

                            <div className="flex h-fit gap-5">
                                <button className="border border-gray-200 rounded-lg py-[10px] h-fit px-6 bg-transparent cursor-pointer select-none hover:bg-gray-200 active:bg-black active:text-white">Дэлгэрэнгүй</button>
                                <div className='w-1/2 rounded-lg py-[10px] h-fit px-10 flex gap-2 items-center justify-center bg-blue-500 cursor-pointer hover:bg-blue-600 active:bg-blue-700 select-none'>
                                    <Mail color='white' />
                                    <p className='text-white'>Холбогдох</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <div className='w-full flex gap-3'>
                        <div className='w-1/2 rounded-lg py-2 px-6 flex gap-2 items-center justify-center bg-blue-500 cursor-pointer hover:bg-blue-600 active:bg-blue-700 select-none'>
                            <Mail color='white' />
                            <p className='text-white'>Холбогдох</p>
                        </div>
                        <div className='w-1/2 border border-neutral-300 rounded-lg py-2 px-6 flex gap-2 items-center justify-center cursor-pointer text-black hover:bg-sky-100 active:bg-black active:text-white select-none'>
                            <p>Цааш үзэх</p>
                        </div>
                    </div> */}
                </div>

                <div>
                    <p className='text-xs font-normal text-neutral-500 mb-1'>Энэ долоо хоногийн зорилго:</p>
                    <p className="text-sm font-medium">Манай бүтээгдэхүүн хөгжүүлэлтийн төлөвлөгөө ба хэрэглэгчийн санал хүсэлт авах үйл явцтай танилцаарай</p>
                </div>
            </div>
        </div>
    );
}