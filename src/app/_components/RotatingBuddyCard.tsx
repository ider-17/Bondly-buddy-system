import { Calendar, Mail, MailIcon, PhoneCall } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

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
            <h6 className='font-semibold text-lg py-5 px-6 mb-0'>Таны 2 долоо хоногийн Buddy</h6>

            <hr />

            <div className="pb-5 px-6">
                <div>
                    <div className='flex justify-between items-center mb-3'>
                        <div className="w-full flex justify-between">
                            <div className='flex gap-3 items-center'>
                                <Avatar className='w-10 h-10'>
                                    <AvatarImage src="https://ooxomufkkqephrlbxshw.supabase.co/storage/v1/object/sign/profile-pics/Screenshot%202025-07-02%20at%202.37.28%20PM.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zMzY0MGJhMi1jYjAzLTRlNGItYTJhYy05YmE5M2VhZWUyZGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwcm9maWxlLXBpY3MvU2NyZWVuc2hvdCAyMDI1LTA3LTAyIGF0IDIuMzcuMjggUE0ucG5nIiwiaWF0IjoxNzUxNDM4MzA0LCJleHAiOjE3ODI5NzQzMDR9.RshkdYTlwzWPPJwQd-EbzLlVaVk3jkd5hn-2UFLhVpA" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h6 className='text-base font-medium'>Дөлгөөн баяр</h6>
                                    <p className='text-neutral-500 text-sm font-normal'>Product Manager</p>
                                </div>
                            </div>

                            <div className="flex h-fit gap-5 justify-end">
                                <div className="border border-neutral-300 rounded-lg py-2 px-6 flex gap-2 font-medium items-center justify-center cursor-pointer hover:bg-gray-200 active:bg-black active:text-white select-none">
                                    <Dialog>
                                        <DialogTrigger>Дэлгэрэнгүй</DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>
                                                    <div className="flex items-center gap-3 text-black pt-5 pr-5 pl-5" >
                                                        <Avatar className="w-15 h-15">
                                                            <AvatarImage src="https://ooxomufkkqephrlbxshw.supabase.co/storage/v1/object/sign/profile-pics/Screenshot%202025-07-01%20at%2015.36.11.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zMzY0MGJhMi1jYjAzLTRlNGItYTJhYy05YmE5M2VhZWUyZGQiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwcm9maWxlLXBpY3MvU2NyZWVuc2hvdCAyMDI1LTA3LTAxIGF0IDE1LjM2LjExLnBuZyIsImlhdCI6MTc1MTM1NTQwMiwiZXhwIjoxNzgyODkxNDAyfQ.bG3QilDsEkRLDxPZ7JMoPrxO1mBUhR24PXhB8Vd6FKA" />
                                                            <AvatarFallback>CN</AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <div className="text-base font-medium">Идэр</div>
                                                            <div className="text-[#525252] text-sm font-medium">Junior Developer</div>
                                                        </div>
                                                    </div>
                                                </DialogTitle>
                                                <DialogDescription className=" p-5">

                                                    <hr className="mt-4" />

                                                    <div className="flex justify-between mt-5 gap-4 text-black">
                                                        <div className="flex-1 border p-4 rounded-xl bg-white">
                                                            <MailIcon />
                                                            <div className="mt-2">Mail</div>
                                                            <div>ider@gmail.com</div>
                                                        </div>
                                                        <div className="flex-1 border p-4 rounded-xl bg-white">
                                                            <PhoneCall />
                                                            <div className="mt-2">Phone number</div>
                                                            <div>+976 98181858</div>
                                                        </div>
                                                        <div className="flex-1 border p-4 rounded-xl bg-white">
                                                            <Calendar />
                                                            <div className="mt-2">Started</div>
                                                            <div>2025 • 06 • 16</div>
                                                        </div>
                                                    </div>



                                                    <div className="w-full py-5 h-fit px-6 mt-5 border text-black border-neutral-300 rounded-xl bg-white">
                                                        <div className="flex items-center">
                                                            <div className="text-lg font-semibold">Сонирхлууд</div>
                                                        </div>

                                                        <div className="flex flex-wrap gap-4 mt-4">
                                                            <div className="text-sm font-semibold py-1 px-[10px] bg-slate-100 rounded-full">📚 Books & Reading</div>
                                                            <div className="text-sm font-semibold py-1 px-[10px] bg-slate-100 rounded-full">🎨 Art & Design</div>
                                                            <div className="text-sm font-semibold py-1 px-[10px] bg-slate-100 rounded-full">🏋️‍♂️ Fitness & Gym</div>
                                                        </div>
                                                    </div>

                                                    <div className="w-full py-5 h-fit px-6 mt-5 border border-neutral-300 text-black rounded-xl bg-white">
                                                        <div className="flex gap-3 items-center">
                                                            <div className="text-lg font-semibold">Карьерийн зорилго</div>
                                                        </div>

                                                        <div className="flex flex-wrap space-y-3 mt-4">
                                                            Developer ажил надад яг миний хайж байсан зүйлийг олж өгсөн. Хэрэглэгчийн асуудлыг шийдэх, үнэ цэнтэй шийдэл бүтээхэд оролцож байгаадаа баяртай байдаг. Одоогоор хэрэглэгчийн судалгаа, дизайн систем, прототип хийх ур чадвараа сайжруулж, багтайгаа илүү үр дүнтэй хамтран ажиллахыг зорьж байна. Цаашдаа бодит нөлөө үзүүлдэг, хэрэглэгч төвтэй шийдэл гаргадаг дизайнер болохыг хүсэж байна. Хэрэглэгчдэд үнэхээр хэрэгтэй зүйлийг бүтээж чадсан тэр мэдрэмж л надад урам өгдөг.
                                                        </div>
                                                    </div>

                                                    <div className="w-full py-5 h-fit px-6 mt-5 border border-neutral-300 text-black rounded-xl bg-white">
                                                        <div className="flex gap-3 items-center">
                                                            <div className="text-lg font-semibold">Танилцуулга</div>
                                                        </div>

                                                        <div className="flex flex-wrap space-y-3 mt-4">
                                                            Сайн уу👋 Намайг Идэр гэдэг. Би Developer чиглэлээр дадлага хийж байгаа intern. Шинэ орчин, шинэ баг хамт олон дунд ажиллаж байгаа болохоор өдөр бүр л шинэ зүйл сурч, өөрийгөө хөгжүүлэхийг хүсэж байна. 😊 Өмнө нь хэрэглэгчтэй ярилцлага хийж үзсэн, wireframe зураад, Figma дээр дизайн гаргаж байсан туршлагатай. Бас багтайгаа хамтран ажиллах, санаагаа илэрхийлэх тал дээр ч суралцаж байгаа. Та надтай хамгийн ойрхон байж, зөвлөгөө өгч, чиглүүлж байх Primary buddy болж байгаад үнэхээр баярлаж байгаа байна. ✨ Ямар нэг зүйлд эргэлзвэл хандах хүн байгаа гэдэг мэдрэмж өөртөө итгэх итгэлийг нэмдэг юм байна. Хэрвээ цаг гарвал миний ажлын талаар санал, зөвлөгөө өгч байгаарай 🙌
                                                        </div>
                                                    </div>

                                                </DialogDescription>
                                            </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                </div>

                                <a target="_blank" href="https://mail.google.com/mail/?view=cm&to=baasandash.davaakhuu@gmail.com" className="w-1/2">
                                    <div className='w-full rounded-lg py-[10px] h-fit px-10 flex gap-2 items-center justify-center bg-blue-500 cursor-pointer hover:bg-blue-600 active:bg-blue-700 select-none'>
                                        <div><Mail size={20} color='white' /></div>
                                        <p className='text-white'>Холбогдох</p>
                                    </div>
                                </a>
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