"use client"

import { Progress } from "@/components/ui/progress";
import { BookOpen, CalendarCheck, CalendarDays, Lightbulb, Mountain, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function YourProgress() {
    const [approvedChallengesLength, setApprovedChallengesLength] = useState<number>(0);

    const fetchApprovedPercentage = async () => {
        const {
            data: { session },
            error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
            alert("User session not found");
            return;
        }

        const userId = session.user.id;

        const { count: approvedCount, error: approvedError } = await supabase
            .from('submissions')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'approved')
            .eq('user_id', userId);

        const { count: totalCount, error: totalError } = await supabase
            .from('challenges')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId);

        if (approvedError || totalError) {
            console.error('Error fetching data:', approvedError || totalError);
            return;
        }

        if (approvedCount !== null && totalCount !== null && totalCount > 0) {
            const percentage = (approvedCount / totalCount) * 100;
            setApprovedChallengesLength(parseFloat(percentage.toFixed(1)));
        } else {
            setApprovedChallengesLength(0);
        }
    };

    useEffect(() => {
        fetchApprovedPercentage();
    }, []);

    return (
        <>
            <div>
                <div className='flex justify-between mb-3'>
                    <p className='text-sm font-medium'>Onboarding Progress</p>
                    <p>{approvedChallengesLength}%</p>
                </div>
                <Progress value={approvedChallengesLength} />
            </div>

            <div className='w-full flex gap-5 justify-between'>
                <div className='w-1/3 bg-white rounded-xl py-5 flex flex-col gap-2'>
                    <div className='w-8 h-8 bg-blue-100 rounded-lg flex justify-center items-center'>
                        <CalendarCheck size={18} color='#2563EB' />
                    </div>

                    <div className='flex flex-col justify-center'>
                        <p className="text-base font-bold">2</p>
                        <p className="text-sm font-medium">Идэвхтэй
                            өдрүүд</p>
                    </div>
                </div>

                <div className='w-1/3 bg-white rounded-xl py-5 flex flex-col gap-2'>
                    <div className='w-8 h-8 bg-amber-100 rounded-lg flex justify-center items-center'>
                        <Mountain size={18} color='#D97706' />
                    </div>

                    <div className='flex flex-col justify-center'>
                        <p className="text-base font-bold">0</p>
                        <p className="text-sm font-medium">Биелүүлсэн
                            сорилтууд</p>
                    </div>
                </div>

                <div className='w-1/3 bg-white rounded-xl py-5 flex flex-col gap-2'>
                    <div className='w-8 h-8 bg-violet-100 rounded-lg flex justify-center items-center'>
                        <Lightbulb size={18} color='#7C3AED' />
                    </div>

                    <div className='flex flex-col justify-center'>
                        <p className="text-base font-bold">2</p>
                        <p className="text-sm font-medium">Уншсан
                            зөвлөмжүүд</p>
                    </div>
                </div>
            </div>
        </>
    )
}