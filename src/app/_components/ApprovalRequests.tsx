import { CircleCheckBig, CircleMinus, SquareCheckBig } from "lucide-react";

export default function ApprovalRequests() {
    return (
        <div className='bg-slate-50 py-5 px-6 rounded-xl border border-[#D4D4D4] space-y-4'>
            <div className='flex gap-3 mb-7'>
                <div className='w-8 h-8 bg-green-100 rounded-lg flex justify-center items-center'>
                    <SquareCheckBig size={20} color='#22C55E' />
                </div>
                <h6 className='text-lg font-semibold'>Approval Requests</h6>
            </div>

            <hr />

            <div className="py-[10px] space-y-4">
                <div className="flex gap-3">
                    <div className='w-8 h-8 bg-green-100 rounded-lg flex justify-center items-center'>
                        <SquareCheckBig size={20} color='#22C55E' />
                    </div>
                    <p>“Өөрийгөө багтаа танилцуулах” challenge-ийг амжилттай биелүүллээ. Хүлээн авч, баталгаажуулж өгнө үү. Баярлалаа 😊✨</p>
                </div>
            </div>

            <div className="flex gap-3">
                <div className="rounded-full py-1 px-[10px] bg-gray-100 text-xs font-semibold">2025 • 06 • 13</div>
                <div className="rounded-full py-1 px-[10px] bg-green-200 text-green-700 text-xs font-semibold">Easy</div>
            </div>

            <div className="flex gap-3">
                <div className="w-1/2 border border-neutral-300 py-2 px-3 rounded-lg flex gap-2 items-center justify-center">
                    <p className="text-sm font-medium">Decline</p>
                    <CircleMinus size={22} color="black" />
                </div>

                <div className="w-1/2 border border-neutral-300 py-2 px-3 rounded-lg flex gap-2 items-center justify-center bg-green-100">
                    <p className="text-sm font-medium">Approve</p>
                    <CircleCheckBig size={22} color="black" />
                </div>
            </div>
        </div>
    )
}