import { CalendarDays, Mail, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfileCard() {
    return (
        <div className="w-full py-5 px-6 border border-neutral-300 rounded-xl bg-slate-50 space-y-5">
            <div className="flex gap-3 items-center">
                <Avatar className="w-24 h-24" >
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-2xl font-semibold">Togtuun</h2>
                    <p className="text-neutral-600 text-base font-medium">Junior Designer</p>
                </div>
            </div>

            <div className="flex gap-5">
                <div className="w-1/3 py-5 px-6 flex gap-2 items-center bg-white rounded-lg">
                    <Mail size={24} color="black" />
                    <div>
                        <p className="text-neutral-600 text-sm font-medium">Mail</p>
                        <p className="text-sm font-medium">Togtuun@apple.com</p>
                    </div>
                </div>

                <div className="w-1/3 py-5 px-6 flex gap-2 items-center bg-white rounded-lg">
                    <CalendarDays size={24} color="black" />
                    <div>
                        <p className="text-neutral-600 text-sm font-medium">Started</p>
                        <p className="text-neutral-600 text-sm font-medium">2025 • 06 • 12</p>
                    </div>
                </div>

                <div className="w-1/3 py-5 px-6 flex gap-2 items-center bg-white rounded-lg">
                    <Phone size={24} color="black" />
                    <div>
                        <p className="text-neutral-600 text-sm font-medium">Phone number</p>
                        <p className="text-neutral-600 text-sm font-medium">+976 99101234</p>
                    </div>
                </div>
            </div>
        </div>
    )
}