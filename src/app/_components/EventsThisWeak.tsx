import { BadgeAlert, BadgeQuestionMark, Brush, CalendarDays, Dices } from "lucide-react";

const events = [
    {
        title: "Team lunch",
        time: "Monday at 12:30 PM",
    },
    {
        title: "New Joiners’ Icebreaker Game",
        time: "Monday at 3:30 PM",
    },
    {
        title: "Ask Me Anything with HR",
        time: "Wednesday at 4:00 PM",
    },
    {
        title: "Intro to Product Workshop",
        time: "Thursday at 5:30 PM",
    },
    {
        title: "Code Review Session",
        time: "Friday at 2:30 PM",
    },
    {
        title: "Design Review Session",
        time: "Monday at 12:30 PM",
    },
];

export default function EventsThisWeek() {
    return (
        <div className='rounded-xl border border-neutral-300 py-5 px-6 space-y-5 bg-white'>
            <div className='flex gap-3 items-center'>
                <h6 className='text-lg font-semibold'>Энэ долоо хоногийн эвентүүд</h6>
            </div>

            {events.map((event, index) => (
                <div key={index} className='w-full'>
                    <hr />
                    <div className='flex gap-4 py-[10px]'>
                        <div>
                            <h6 className='text-base font-medium'>{event.title}</h6>
                            <p className='text-sm font-medium text-neutral-600'>{event.time}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
