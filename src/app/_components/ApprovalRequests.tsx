'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { approveChallenge } from "@/lib/actions/submitChallenge"
import { CircleCheckBig, CircleMinus, SquareCheckBig } from "lucide-react"
import { toast } from "sonner"

interface Challenge {
    id: string
    title: string
    difficulty: 'Easy' | 'Medium' | 'Hard'
    created_at: string
}

export default function ApprovalRequests() {
    const [pendingChallenges, setPendingChallenges] = useState<Challenge[]>([])

    useEffect(() => {
        const fetchPending = async () => {
            const { data, error } = await supabase
                .from('challenges')
                .select('id, title, difficulty, created_at')
                .eq('status', 'pending')

            if (!error && data) {
                setPendingChallenges(data)
            }
        }

        fetchPending()
    }, [])

    const handleApprove = async (id: string) => {
        try {
            await approveChallenge(id)
            setPendingChallenges(prev => prev.filter(ch => ch.id !== id))

            toast.success("Амжилттай баталгаажууллаа!")
        } catch (error) {
            toast.error("Баталгаажуулах үед алдаа гарлаа!")
        }
    }


    return (
        <div className='bg-slate-50 py-5 px-6 rounded-xl border border-[#D4D4D4] space-y-6'>
            <div className='flex gap-3 mb-1'>
                <div className='w-8 h-8 bg-green-100 rounded-lg flex justify-center items-center'>
                    <SquareCheckBig size={20} color='#22C55E' />
                </div>
                <h6 className='text-lg font-semibold'>Approval Requests</h6>
            </div>

            <hr />

            {pendingChallenges.length === 0 && (
                <p className="text-sm text-neutral-500">No pending approvals.</p>
            )}

            {pendingChallenges.map((challenge) => (
                <div key={challenge.id} className="space-y-4">
                    <div className="flex gap-3">
                        <div className='w-8 h-8 bg-green-100 rounded-lg flex justify-center items-center'>
                            <SquareCheckBig size={20} color='#22C55E' />
                        </div>
                        <p>
                            “{challenge.title}” challenge-ийг амжилттай биелүүллээ. Хүлээн авч, баталгаажуулж өгнө үү. Баярлалаа 😊✨
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <div className="rounded-full py-1 px-[10px] bg-gray-100 text-xs font-semibold">
                            {new Date(challenge.created_at).toLocaleDateString('en-CA', {
                                year: 'numeric', month: '2-digit', day: '2-digit'
                            })}
                        </div>
                        <div className="rounded-full py-1 px-[10px] bg-green-200 text-green-700 text-xs font-semibold">
                            {challenge.difficulty}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="w-1/2 border border-neutral-300 py-2 px-3 rounded-lg flex gap-2 items-center justify-center cursor-not-allowed opacity-50">
                            <p className="text-sm font-medium">Decline</p>
                            <CircleMinus size={22} color="black" />
                        </div>

                        <button
                            onClick={() => handleApprove(challenge.id)}
                            className="w-1/2 border border-neutral-300 py-2 px-3 rounded-lg flex gap-2 items-center justify-center bg-green-100 cursor-pointer"
                        >
                            <p className="text-sm font-medium">Approve</p>
                            <CircleCheckBig size={22} color="black" />
                        </button>
                    </div>

                    <hr />
                </div>
            ))}
        </div>
    )
}
