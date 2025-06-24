import { ArrowRight, FilePlus2, Mountain, Sparkles } from "lucide-react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

interface Challenge {
    id: string;
    title: string;
    week: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    icon: React.ReactNode;
}

export default function ActiveChallenges() {

    const challenges: Challenge[] = [
        {
            id: '1',
            title: 'Өөрийгөө багтаа танилцуулаарай😊',
            week: 'Week 1',
            difficulty: 'Easy',
            icon: <Sparkles size={18} color="#22C55E" />
        },
        {
            id: '2',
            title: 'Эхний долоо хоногийн сэтгэгдлээ тэмдэглээрэй📝',
            week: 'Week 1',
            difficulty: 'Easy',
            icon: <Sparkles size={18} color="#22C55E" />
        },
        {
            id: '3',
            title: 'Компанийн mission statement-ийг уншаарай🎯',
            week: 'Week 1',
            difficulty: 'Easy',
            icon: <Sparkles size={18} color="#22C55E" />
        }
    ];

    return (
        <div className='Events rounded-xl border border-neutral-300 py-5 px-6 space-y-7'>
            <div className="flex justify-between items-center">
                <div className="flex gap-3">
                    <div className='w-8 h-8 bg-green-100 rounded-lg flex justify-center items-center'>
                        <Mountain size={18} color='#22C55E' />
                    </div>
                    <h6 className="text-lg font-semibold">Active Challenges</h6>
                </div>

                <div className="border border-neutral-300 rounded-lg py-2 px-3 bg-white flex gap-2 items-center">
                    <p>View all</p>
                    <ArrowRight size={18} />
                </div>
            </div>

            {challenges.map((challenge) => (
                <div key={challenge.id} className="py-[10px] space-y-4">
                    <hr />

                    <div className="flex gap-2 items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            {challenge.icon}
                        </div>
                        <p className="text-sm font-medium">{challenge.title}</p>
                    </div>

                    <div className="flex gap-3">
                        <button className="rounded-full py-1 px-[10px] bg-gray-100 text-xs font-semibold">{challenge.week}</button>
                        <button className="rounded-full py-1 px-[10px] bg-green-200 text-green-700 text-xs font-semibold">{challenge.difficulty}</button>
                    </div>

                    <Dialog>
                        <form>
                            <DialogTrigger asChild>
                                <div className="flex gap-2 border border-neutral-300 py-2 px-3 bg-white rounded-lg items-center w-fit cursor-pointer">
                                    <div>Write note</div>
                                    <FilePlus2 size={20} />
                                </div>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[445px]">
                                <DialogHeader>
                                    <div className="border border-neutral-300 rounded-xl py-5 px-6 bg-white space-y-5">
                                        <div>
                                            <div className="text-lg font-semibold">Write Note</div>
                                            <div className="text-sm font-medium">Complete your first code review</div>
                                        </div>

                                        <hr />

                                        <div>
                                            <div className="text-sm font-medium mb-2">Challenge Notes</div>

                                            <textarea placeholder="Describe your progress, challenges faced, and what you’ve learned..." className="w-full border border-neutral-300 bg-white py-2 px-3 rounded-md" />
                                        </div>

                                        <hr />

                                        <div className="flex gap-[10px] justify-between">

                                            <DialogClose asChild>
                                                <div className="w-1/2 py-1 px-4 flex justify-center items-center border border-neutral-300 rounded-md cursor-pointer">Cancel</div>
                                            </DialogClose>

                                            <div className="w-1/2 border py-2 px-4 bg-black text-white flex justify-center items-center rounded-md">Request Approval</div>
                                        </div>
                                    </div>
                                    <DialogTitle></DialogTitle>
                                    <DialogDescription>
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </form>
                    </Dialog>
                </div>
            ))}

        </div>
    )
}