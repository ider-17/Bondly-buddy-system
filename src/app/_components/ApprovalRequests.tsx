'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { CircleCheckBig, CircleMinus, Pen, SquareCheckBig } from "lucide-react"
import { toast } from 'sonner'

interface Challenge {
    id: string
    title: string
    note: string | null
    difficulty: string
    created_at: string
    status: string
}

export default function ApprovalRequests() {
    const [requests, setRequests] = useState<Challenge[]>([])
    const latestIds = useRef<Set<string>>(new Set())

    async function fetchPendingRequests() {
        const { data, error } = await supabase
            .from('challenges')
            .select('*')
            .eq('status', 'pending')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Fetch error:', error.message)
            return
        }

        // Шинэ хүсэлтийг toast-оор мэдэгдэнэ
        data?.forEach((req) => {
            if (!latestIds.current.has(req.id)) {
                toast.success(`New approval request: ${req.title}`)
                latestIds.current.add(req.id)
            }
        })

        setRequests(data ?? [])
    }

    useEffect(() => {
        fetchPendingRequests()
        const interval = setInterval(fetchPendingRequests, 10000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className='bg-slate-50 py-5 px-6 rounded-xl border border-[#D4D4D4] space-y-4'>
            <div className='flex gap-3 mb-7'>
                <div className='w-8 h-8 bg-green-100 rounded-lg flex justify-center items-center'>
                    <SquareCheckBig size={20} color='#22C55E' />
                </div>
                <h6 className='text-lg font-semibold'>Approval Requests</h6>
            </div>

            <hr />

            {requests.map((req) => (
                <div key={req.id} className="space-y-4">
                    <div className="flex gap-3">
                        <div className='w-8 h-8 bg-green-100 rounded-lg flex justify-center items-center'>
                            <SquareCheckBig size={20} color='#22C55E' />
                        </div>
                        <p>“{req.title}” challenge-ийг амжилттай биелүүллээ. Хүлээн авч, баталгаажуулж өгнө үү. Баярлалаа 😊✨</p>
                    </div>

                    {req.note && (
                        <div className="bg-white text-sm w-fit rounded-full px-3 py-2 text-gray-700 flex items-center">
                            <div className='w-8 h-8 flex justify-center items-center rounded-lg'>
                                <Pen size={18} color='black' />
                            </div>
                            <p>{req.note}</p>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <div className="rounded-full py-1 px-[10px] bg-gray-100 text-xs font-semibold">
                            {new Date(req.created_at).toLocaleDateString('en-GB')}
                        </div>
                        <div className="rounded-full py-1 px-[10px] bg-green-200 text-green-700 text-xs font-semibold">
                            {req.difficulty}
                        </div>
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

                    <hr className="mt-4" />
                </div>
            ))}

            {requests.length === 0 && (
                <p className="text-sm text-gray-500">No approval requests found.</p>
            )}
        </div>
    )
}
