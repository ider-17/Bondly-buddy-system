import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Mail, Phone } from "lucide-react"

export default function ProfileInfo() {
    return (
        <div className="w-full border border-neutral-300 py-5 px-6 bg-slate-50 rounded-xl">
            <div className="flex gap-3 items-center">
                <Avatar className="w-16 h-16">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div>
                    <h6 className="text-2xl">Taivanbat</h6>
                    <p className="text-neutral-600 font-medium text-base">Senior Designer</p>
                </div>
            </div>

            <div className="flex gap-5">
                <div className="w-1/3 py-5 px-6 flex gap-2 items-center bg-white rounded-lg">
                    <Mail size={24} color="black" />
                    <div>
                        <p className="text-neutral-600 text-sm font-medium">Mail</p>
                        <p className="text-sm font-medium">Taivanbat@apple.com</p>
                    </div>
                </div>

                <div className="w-1/3 py-5 px-6 flex gap-2 items-center bg-white rounded-lg">
                    <CalendarDays size={24} color="black" />
                    <div>
                        <p className="text-neutral-600 text-sm font-medium">Started</p>
                        <p className="text-neutral-600 text-sm font-medium">2021 • 08 • 18</p>
                    </div>
                </div>

                <div className="w-1/3 py-5 px-6 flex gap-2 items-center bg-white rounded-lg">
                    <Phone size={24} color="black" />
                    <div>
                        <p className="text-neutral-600 text-sm font-medium">Phone number</p>
                        <p className="text-neutral-600 text-sm font-medium">+976 88111234</p>
                    </div>
                </div>
            </div>
        </div>
    )
}