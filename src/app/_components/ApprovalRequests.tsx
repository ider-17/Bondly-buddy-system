'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { CircleCheckBig, CircleMinus, SquareCheckBig } from "lucide-react"
import { toast } from "sonner"

interface Challenge {
    id: string
    title: string
    week: string
    difficulty: 'Easy' | 'Medium' | 'Hard'
    note: string | null
    created_at: string
}

export default function ApprovalRequests() {
    const [requests, setRequests] = useState<Challenge[]>([])

    // Previously seen challenge IDs are stored in localStorage
    function getSeenIds(): Set<string> {
        const raw = localStorage.getItem('seenChallengeIds')
        return raw ? new Set(JSON.parse(raw)) : new Set()
    }

    function saveSeenIds(ids: Set<string>) {
        localStorage.setItem('seenChallengeIds', JSON.stringify(Array.from(ids)))
    }

    async function fetchApprovalRequests() {
        const { data, error } = await supabase
            .from('challenges')
            .select('*')
            .eq('status', 'pending')
            .order('created_at', { ascending: false })

        if (error) {
            toast.error("Failed to fetch approval requests: " + error.message)
        } else {
            const seen = getSeenIds()
            const newOnes = (data ?? []).filter((item) => !seen.has(item.id))

            newOnes.forEach(item => {
                toast.success(`New approval request: "${item.title}"`)
                seen.add(item.id)
            })
            saveSeenIds(seen)

            setRequests(data ?? [])
        }
    }

    useEffect(() => {
        fetchApprovalRequests()
        const interval = setInterval(fetchApprovalRequests, 10000)
        return () => clearInterval(interval)
    }, [])

    async function handleApprove(challengeId: string) {
        const { error } = await supabase
            .from('challenges')
            .update({ status: 'approved' })
            .eq('id', challengeId)

        if (error) {
            toast.error("Failed to approve challenge: " + error.message)
        } else {
            toast.success("Challenge approved!")
            fetchApprovalRequests()
        }
    }

    async function handleDecline(challengeId: string) {
        const { error } = await supabase
            .from('challenges')
            .update({ status: 'declined' })
            .eq('id', challengeId)

        if (error) {
            toast.error("Failed to decline challenge: " + error.message)
        } else {
            toast.success("Challenge declined!")
            fetchApprovalRequests()
        }
    }

    return (
        <div className='bg-slate-50 py-5 px-6 rounded-xl border border-[#D4D4D4] space-y-4'>
            <div className='flex gap-3 mb-7'>
                <div className='w-8 h-8 bg-green-100 rounded-lg flex justify-center items-center'>
                    <SquareCheckBig size={20} color='#22C55E' />
                </div>
                <h6 className='text-lg font-semibold'>Approval Requests</h6>
            </div>

            <hr />

            {requests.length === 0 && <p className="text-sm text-gray-500">No pending challenges.</p>}

            {requests.map((challenge) => (
                <div key={challenge.id} className="py-[10px] space-y-4 border-b border-neutral-200">
                    <div className="flex gap-3">
                        <div className='w-8 h-8 bg-green-100 rounded-lg flex justify-center items-center'>
                            <SquareCheckBig size={20} color='#22C55E' />
                        </div>
                        <div>
                            <p className="font-medium">{challenge.title}</p>
                            {challenge.note && (
                                <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">{challenge.note}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <div className="rounded-full py-1 px-[10px] bg-gray-100 text-xs font-semibold">
                            {new Date(challenge.created_at).toLocaleDateString()}
                        </div>
                        <div className="rounded-full py-1 px-[10px] bg-green-200 text-green-700 text-xs font-semibold">
                            {challenge.difficulty}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => handleDecline(challenge.id)}
                            className="w-1/2 border border-neutral-300 py-2 px-3 rounded-lg flex gap-2 items-center justify-center select-none bg-transparent text-black hover:bg-orange-100 active:bg-orange-500 active:text-white"
                        >
                            <p className="text-sm font-medium">Decline</p>
                            <CircleMinus size={22} />
                        </button>

                        <button
                            onClick={() => handleApprove(challenge.id)}
                            className="w-1/2 border border-neutral-300 py-2 px-3 rounded-lg flex gap-2 items-center justify-center bg-green-100 hover:bg-green-200 active:bg-green-500 active:text-white select-none cursor-pointer text-black"
                        >
                            <p className="text-sm font-medium">Approve</p>
                            <CircleCheckBig size={22} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
