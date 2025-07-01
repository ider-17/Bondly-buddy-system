import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import RotatingBuddyCard from "@/app/_components/RotatingBuddyCard";
import EventsThisWeek from "@/app/_components/EventsThisWeak";
import YourProgress from "@/app/_components/YourProgress";
import ActiveChallenges from "@/app/_components/ActiveChallenges";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Home() {
  return (
    <div>
      <header className="h-fit header p-5 px-20 flex justify-between bg-white items-center border-b border-gray-200">
        <div className="flex gap-3 items-center">
          <Avatar className="w-10 h-10">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h6 className="text-base font-medium">Сайн уу👋 Тогтуун</h6>
            <p className="text-neutral-500 font-medium text-sm">
              UX/UI Designer
            </p>
          </div>
        </div>
        <div>
          <Popover>
            <PopoverTrigger>
              <Bell className="cursor-pointer" size={18} />
            </PopoverTrigger>
            <PopoverContent>Notifications</PopoverContent>
          </Popover>
        </div>
      </header>

      <div className="flex gap-5 py-10 px-20 bg-slate-100 min-h-screen">
        <div className="w-1/2 space-y-5">
          <RotatingBuddyCard />

          <div className="rounded-lg border border-gray-200 py-5 px-6 space-y-5 bg-white">
            <div className="flex items-center">
              <h6 className="text-lg font-medium">Идэвхтэй сорилтууд</h6>
            </div>
            <ActiveChallenges />
          </div>
        </div>
        
        <div className="w-1/2 space-y-5">
          <div className='rounded-lg border border-gray-200 py-5 px-6 space-y-5 bg-white'>
            <div>
              <h6 className='text-lg font-medium mb-5'>Таны прогресс</h6>
              <hr />
              <YourProgress />
            </div>
          </div>

          <EventsThisWeek />
        </div>
      </div>
    </div>
  );
}