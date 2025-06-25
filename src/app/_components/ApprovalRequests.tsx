'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
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
    const latestIdsRef = useRef<Set<string>>(new Set())

    async function fetchRequests() {
        const { data, error } = await supabase
            .from('challenges')
            .select('*')
            .eq('status', 'pending')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Failed to fetch:', error.message)
            return
        }

        // notification logic — шинэ хүсэлтүүдийг шалгана
        data?.forEach((item) => {
            if (!latestIdsRef.current.has(item.id)) {
                toast.success(`New approval request: ${item.title}`)
                latestIdsRef.current.add(item.id)
            }
        })

        setRequests(data ?? [])
    }

    useEffect(() => {
        fetchRequests() // эхний удаа fetch

        const interval = setInterval(() => {
            fetchRequests()
        }, 10000) // 10 секунд тутам

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Approval Requests</h2>
            {requests.length === 0 && <p className="text-gray-500">No requests.</p>}

            {requests.map((req) => (
                <div
                    key={req.id}
                    className="bg-white border border-gray-300 rounded-lg p-4 space-y-1"
                >
                    <p className="font-medium">{req.title}</p>
                    <p className="text-sm text-gray-600">{req.note}</p>
                    <div className="text-xs text-green-700">{req.difficulty}</div>
                </div>
            ))}
        </div>
    )
}
