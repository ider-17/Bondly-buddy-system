import { BadgeAlert, BadgeQuestionMark, Brush, CalendarDays, Dices } from "lucide-react";

export default function EventsThisWeek() {
    return (
        <div className='rounded-xl border border-neutral-300 py-5 px-6 space-y-5 bg-slate-50'>
            <div className='flex gap-3 items-center'>
                <div className='w-8 h-8 bg-indigo-100 rounded-lg flex justify-center items-center'>
                    <CalendarDays size={18} color='#6366F1' />
                </div>
                <h6 className='text-lg font-semibold'>Events This Week</h6>
            </div>

            <div className='w-full'>
                <hr />

                <div className='flex gap-4 py-[10px]'>
                    <div className='w-12 h-12 rounded-lg bg-teal-100 flex justify-center items-center'>
                        <CalendarDays size={24} color='#14B8A6' />
                    </div>

                    <div>
                        <h6 className='text-base font-medium'>Team lunch</h6>
                        <p className='text-sm font-medium text-neutral-600'>Monday at 12:30 PM</p>
                    </div>
                </div>
            </div>

            <div className='w-full'>
                <hr />

                <div className='flex gap-4 py-[10px]'>
                    <div className='w-12 h-12 rounded-lg bg-indigo-100 flex justify-center items-center'>
                        <Dices size={24} color='#6366F1' />
                    </div>

                    <div>
                        <h6 className='text-base font-medium'>New Joiners’ Icebreaker Game</h6>
                        <p className='text-sm font-medium text-neutral-600'>Monday at 3:30 PM</p>
                    </div>
                </div>
            </div>

            <div className='w-full'>
                <hr />

                <div className='flex gap-4 py-[10px]'>
                    <div className='w-12 h-12 rounded-lg bg-teal-100 flex justify-center items-center'>
                        <BadgeQuestionMark size={24} color='#14B8A6' />
                    </div>

                    <div>
                        <h6 className='text-base font-medium'>Ask Me Anything with HR</h6>
                        <p className='text-sm font-medium text-neutral-600'>Wednesday at 4:00 PM</p>
                    </div>
                </div>
            </div>

            <div className='w-full'>
                <hr />

                <div className='flex gap-4 py-[10px]'>
                    <div className='w-12 h-12 rounded-lg bg-cyan-100 flex justify-center items-center'>
                        <BadgeAlert size={24} color='#06B6D4' />
                    </div>

                    <div>
                        <h6 className='text-base font-medium'>Intro to Product Workshop</h6>
                        <p className='text-sm font-medium text-neutral-600'>Thursday at 5:30 PM</p>
                    </div>
                </div>
            </div>

            <div className='w-full'>
                <hr />

                <div className='flex gap-4 py-[10px]'>
                    <div className='w-12 h-12 rounded-lg bg-lime-100 flex justify-center items-center'>
                        <svg width="24" height="24" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 19.3555C7.89617 19.3555 7.79425 19.3456 7.69425 19.3258C7.59425 19.3058 7.49725 19.2791 7.40325 19.2458C5.28825 18.4958 3.609 17.166 2.3655 15.2565C1.12183 13.3469 0.5 11.2863 0.5 9.07479V4.57104C0.5 4.19121 0.60925 3.84929 0.82775 3.54529C1.04608 3.24146 1.3285 3.02121 1.675 2.88454L7.36725 0.759543C7.58142 0.682543 7.79233 0.644043 8 0.644043C8.20767 0.644043 8.41858 0.682543 8.63275 0.759543L14.325 2.88454C14.6715 3.02121 14.9539 3.24146 15.1723 3.54529C15.3908 3.84929 15.5 4.19121 15.5 4.57104V9.07479C15.5 10.1966 15.3314 11.2989 14.9943 12.3815C14.6571 13.4642 14.1598 14.4754 13.5023 15.415C13.3828 15.5934 13.2175 15.6867 13.0065 15.695C12.7957 15.7034 12.6121 15.6306 12.4557 15.4768L9.8845 12.9055C9.61017 13.0952 9.31183 13.2375 8.9895 13.3325C8.667 13.4274 8.33717 13.4748 8 13.4748C7.0375 13.4748 6.21358 13.132 5.52825 12.4465C4.84275 11.7612 4.5 10.9373 4.5 9.97479C4.5 9.01229 4.84275 8.18838 5.52825 7.50304C6.21358 6.81754 7.0375 6.47479 8 6.47479C8.9625 6.47479 9.78642 6.81754 10.4718 7.50304C11.1573 8.18838 11.5 9.01229 11.5 9.97479C11.5 10.3123 11.4542 10.6384 11.3625 10.953C11.2708 11.2675 11.1398 11.5671 10.9693 11.8518L12.8345 13.717C13.1935 13.0145 13.4775 12.277 13.6865 11.5045C13.8955 10.7322 14 9.92229 14 9.07479V4.56129C14 4.49729 13.9823 4.43963 13.947 4.38829C13.9118 4.33696 13.8622 4.29846 13.798 4.27279L8.10575 2.14779C8.07375 2.13496 8.0385 2.12854 8 2.12854C7.9615 2.12854 7.92625 2.13496 7.89425 2.14779L2.202 4.27279C2.13783 4.29846 2.08817 4.33696 2.053 4.38829C2.01767 4.43963 2 4.49729 2 4.56129V9.07479C2 11.0915 2.56667 12.9248 3.7 14.5748C4.83333 16.2248 6.26667 17.3248 8 17.8748C8.30517 17.7786 8.60292 17.6626 8.89325 17.5268C9.18358 17.3908 9.46983 17.2318 9.752 17.0498C9.92767 16.9421 10.1198 16.9007 10.3282 16.9255C10.5369 16.9502 10.7044 17.0493 10.8307 17.2228C10.9526 17.3985 10.9918 17.5859 10.9485 17.785C10.905 17.9842 10.7965 18.1398 10.623 18.2518C10.2962 18.4518 9.96925 18.6357 9.64225 18.8035C9.31542 18.9715 8.96792 19.1222 8.59975 19.2555C8.50375 19.2889 8.40575 19.3139 8.30575 19.3305C8.20575 19.3472 8.10383 19.3555 8 19.3555ZM8 11.9748C8.55 11.9748 9.02083 11.779 9.4125 11.3873C9.80417 10.9956 10 10.5248 10 9.97479C10 9.42479 9.80417 8.95396 9.4125 8.56229C9.02083 8.17063 8.55 7.97479 8 7.97479C7.45 7.97479 6.97917 8.17063 6.5875 8.56229C6.19583 8.95396 6 9.42479 6 9.97479C6 10.5248 6.19583 10.9956 6.5875 11.3873C6.97917 11.779 7.45 11.9748 8 11.9748Z" fill="#84CC16" />
                        </svg>
                    </div>

                    <div>
                        <h6 className='text-base font-medium'>Code Review Session</h6>
                        <p className='text-sm font-medium text-neutral-600'>Friday at 2:30 PM</p>
                    </div>
                </div>
            </div>

            <div className='w-full'>
                <hr />

                <div className='flex gap-4 py-[10px]'>
                    <div className='w-12 h-12 rounded-lg bg-indigo-100 flex justify-center items-center'>
                        <Brush size={24} color='#6366F1' />
                    </div>

                    <div>
                        <h6 className='text-base font-medium'>Design Review Session</h6>
                        <p className='text-sm font-medium text-neutral-600'>Monday at 12:30 PM</p>
                    </div>
                </div>
            </div>
        </div>
    )
}