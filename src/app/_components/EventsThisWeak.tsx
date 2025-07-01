import { CalendarDays } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";

const events = [
    {
        title: "Team lunch",
        time: "Monday at 12:30 PM",
    },
    {
        title: "Шинэ гишүүдийн танилцах тоглоом",
        time: "Monday at 3:30 PM",
    },
    {
        title: "HR-тай чөлөөт асуулт & хариулт",
        time: "Wednesday at 4:00 PM",
    },
    {
        title: "Бүтээгдэхүүний танилцуулах сургалт",
        time: "Thursday at 5:30 PM",
    },
    {
        title: "Код review уулзалт",
        time: "Friday at 2:30 PM",
    },
    {
        title: "Дизайн review уулзалт",
        time: "Monday at 12:30 PM",
    },
];

function EventsSkeleton() {
    return (
        <div className='rounded-xl border border-neutral-200 py-5 px-6 space-y-5 bg-white'>
            <div className='flex gap-3 items-center'>
                <Skeleton className="h-7 w-64" />
            </div>

            {[...Array(6)].map((_, index) => (
                <div key={index} className='w-full'>
                    <hr />
                    <div className='flex gap-4 py-[10px]'>
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function EventsThisWeek() {
    const [isLoading, setIsLoading] = useState(true);

    // Simulate loading state
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <EventsSkeleton />;
    }

    return (
        <div className='rounded-xl space-y-4 bg-white'>
            <div className='flex gap-3 items-center'>
                <h6 className='text-xl font-semibold'>Энэ долоо хоногийн эвентүүд</h6>
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