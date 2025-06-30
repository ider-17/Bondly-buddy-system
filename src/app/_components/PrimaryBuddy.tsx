import { Mail } from 'lucide-react';
import { Phone } from 'lucide-react';
import { CalendarDays } from 'lucide-react';
export default function PrimaryBuddy() {
    return (
        <div className='bg-white rounded-xl border px-6 py-5'>
            <div className="max-w-full flex">
                <div className='flex '>
                    <div>
                        <p className='text-lg font-medium'>Тайванбат</p>
                        <p className='text-sm font-medium text-neutral-500'>Senior Designer</p>
                    </div>
                    <div className='flex'>
                        <button className='bg-[#3B82F6] py-2 px-5 flex gap-2 text-white rounded-lg items-center'>
                            <Mail />
                            Надтай холбогдох
                        </button>
                    </div>

                </div>
            </div>

            <div className='flex'>
                <div className='border rounded-lg'>
                    <div className='px-6 py-2'>
                        <Mail />
                        <div>
                            <p className='text-xs font-medium text-neutral-500'>И-мэйл</p>
                            <p className='text-sm font-normal'>Taivanbat@apple.com</p>
                        </div>
                    </div>

                </div>
                <div className='border rounded-lg'>
                     <div className='px-6 py-2'>
                    <Phone />
                    <div>
                        <p className='text-xs font-medium text-neutral-500'>Утасны дугаар</p>
                        <p className='text-sm font-normal'>+976 88111234</p>
                    </div>
                    </div>
                </div>
                <div className='border rounded-lg'>
                     <div className='px-6 py-2'>
                    <CalendarDays />
                    <div>
                        <p className='text-xs font-medium text-neutral-500'>Эхэлсэн хугацаа</p>
                        <p className='text-sm font-normal'>2021.08.18</p>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}