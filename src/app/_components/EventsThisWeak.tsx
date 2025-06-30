import { BadgeAlert, BadgeQuestionMark, Brush, CalendarDays, Dices } from "lucide-react";

export default function EventsThisWeek() {
    return (
        <div className='rounded-lg border border-gray-200 py-5 px-6 space-y-5 bg-white'>
            <h6 className='text-lg font-medium'>Энэ долоо хоногийн эвентүүд</h6>

            <div className='w-full'>
                <div className='flex gap-4 py-[10px] mb-[10px]'>
                    <div>
                        <h6 className='text-base font-medium'>Team lunch</h6>
                        <p className='text-sm font-medium text-neutral-600'>Monday at 12:30 PM</p>
                    </div>
                </div>

                <hr />
            </div>

            <div className='w-full'>
                <div className='flex gap-4 py-[10px] mb-[10px]'>
                    <div>
                        <h6 className='text-base font-medium'>Шинэ гишүүдийн танилцах тоглоом</h6>
                        <p className='text-sm font-medium text-neutral-600'>Monday at 3:30 PM</p>
                    </div>
                </div>

                <hr />
            </div>

            <div className='w-full'>
                <div className='flex gap-4 py-[10px] mb-[10px]'>
                    <div>
                        <h6 className='text-base font-medium'>HR-тай чөлөөт асуулт & хариулт</h6>
                        <p className='text-sm font-medium text-neutral-600'>Wednesday at 4:00 PM</p>
                    </div>
                </div>

                <hr />
            </div>

            <div className='w-full'>
                <div className='flex gap-4 py-[10px] mb-[10px]'>
                    <div>
                        <h6 className='text-base font-medium'>Бүтээгдэхүүний танилцуулах сургалт</h6>
                        <p className='text-sm font-medium text-neutral-600'>Thursday at 5:30 PM</p>
                    </div>
                </div>

                <hr />
            </div>

            <div className='w-full'>
                <div className='flex gap-4 py-[10px] mb-[10px]'>
                    <div>
                        <h6 className='text-base font-medium'>Код review уулзалт</h6>
                        <p className='text-sm font-medium text-neutral-600'>Friday at 2:30 PM</p>
                    </div>
                </div>

                <hr />
            </div>

            <div className='w-full'>
                <div className='flex gap-4 py-[10px] mb-[10px]'>
                    <div>
                        <h6 className='text-base font-medium'>Дизайн review уулзалт</h6>
                        <p className='text-sm font-medium text-neutral-600'>Friday at 3:40 PM</p>
                    </div>
                </div>
            </div>
        </div>
    )
}