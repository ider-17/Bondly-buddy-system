"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Lightbulb } from 'lucide-react';
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const categorizedSteps = {
    career: [
        {
            content: "Өөрийн зорилгоо тодорхой болго. Богино болон урт хугацааны зорилтоо бичиж, алхам алхмаар урагшил 🔥",
        },
        {
            content: "Шинэ зүйлд суралцахаас бүү ай. Ажлынхаа хүрээнд хэрэгтэй нэг шинэ ур чадварыг сонгоод сураарай💡",
        },
        {
            content: "Feedback бол хөгжил. Удирдлага болон багийнхаа зүгээс өгсөн санал шүүмжийг нээлттэй хүлээж ав💡",
        },
        {
            content: "Portfolio-той ажилла. Оролцсон ажлуудаа тэмдэглэж, хийсэн ажлаа баримтжуулж эхэл💡",
        },
        {
            content: "Тодорхой байдал бол итгэл төрүүлдэг. Чи юу хийдэг, юунд чиглэж байгаагаа бусдад ойлгомжтой илэрхийлж сур💡",
        },
    ],
    technical: [
        {
            content: "1% илүү ойлголт өдөр бүр чамайг хол явуулна. Бага багаар суралц, асуухаас бүү ич💡",
        },
        {
            content: "Хэрэгтэй товчлолуудыг тогтоо. Өдөр тутам ашигладаг программын shortcut-уудыг судлаарай💡",
        },
        {
            content: "Design гаргахдаа үргэлж тэмдэглэж байгаарай. Тэмдэглэл бол ойлголтын баталгаа💡",
        },
        {
            content: "Бусдын хийсэн зүйлийг задалж хар. Code, component, layout зэргийг задлан шинжлэх нь суралцах хамгийн хурдан арга✨",
        }
    ],
    communication: [
        {
            content: "Сонсох нь илүү чухал. Бусдыг сайн сонсох нь найдвартай харилцааны эхлэл✨",
        },
        {
            content: "Асуух нь буруу биш. Эргэлзэж байгаа зүйлээ зоригтой асууж сур✨",
        },
        {
            content: "Эелдэг байдал бол мэргэжлийн ур чадвар. Баярлалаа, Уучлаарай гэдэг үгсийг өдөр тутам хэрэглэ✨",
        },
        {
            content: "Хүлээлтээ тодорхой хэл. Ажлын хугацаа, хүргэх үр дүнг урьдчилж илэрхийлэх нь төөрөгдлөөс сэргийлнэ🔥",
        },
        {
            content: "Зөрчил үүсвэл, тайван байж ярилц. Хувийн биш ажлын шалтгааныг төв болгон ханд✨",
        },

    ],
    leadership: [
        {
            content: "Хариуцлага бол манлайллын үндэс. Өөрийн ажлыг өөрөө хариуцаж сур💡",
        },
        {
            content: "Манлайлагч бүгдийг мэддэггүй, асуудаг. Бусдаас суралцах зоригтой бай💡",
        },
        {
            content: "Шийдвэр гаргалтад оролц. Ямар нэг асуудал дээр санал, шийдэл гаргаж бай💡",
        },
        {
            content: "Бусдад үлгэрлэ. Хугацаандаа ажлаа хийх, хурдан хариу өгөх нь өөрөө манлайллын хэлбэр юм💡",
        }
    ],
    teamwork: [
        {
            content: "Нээлттэй, ойлгомжтой ханд. Мэдээллээ хаалттай байлгах нь үл ойлголцолд хүргэдэг🤝",
        },
        {
            content: "Бусдын оронд өөрийгөө тавьж үз. Empathy бол хамтын ажиллагааны түлхүүр🤝",
        },
        {
            content: "Хуваалц, тусал. Чиний мэддэг зүйлийг бусдад зааж өгөх нь багийг өсгөдөг🤝",
        },
        {
            content: "Зорилгоо нэгтгэ. Багаар ажиллаж буй бол бүх гишүүдийн зорилгыг ойлгохыг хичээ🤝",
        },
        {
            content: "Амжилтад нь баяр хүргэ. Бусдын амжилтыг үнэлэх нь итгэлцэл бий болгодог🤝",
        },
    ],
    workupbalance: [
        {
            content: "Ажлаас гарч амьсгаа ав. 5 минутын завсарлага хүртэл чухал🫶",
        },
        {
            content: "Ажлын цагаар ажилла, амралтын цагаар амар. Ялгаа заагтай байх нь стресс бууруулдаг🫶",
        },
        {
            content: "Өөрийгөө урамшуул. Сайн хийсэн ажлынхаа дараа өөртөө багахан баяр өг✨",
        },
        {
            content: "Үгүй гэж хэлж сур. Ачааллаа хэт нэмэх нь бүтээмж бууруулах эрсдэлтэй🫶",
        },
        {
            content: "Хөдөлгөөн, амралт зэрэг чухал. Ажил дээр бүтээмжтэй байх үндэс нь сайн унтаж амрах😴",
        },
    ],
} as const

const categoryLabels: Record<string, string> = {
    all: "Бүгд",
    career: "Карьер",
    technical: "Техникийн ур чадвар",
    communication: "Харилцааны чадвар",
    leadership: "Манлайлалын ур чадвар",
    teamwork: "Багаар ажиллах",
    workupbalance: "Ажил-амьдралын тэнцвэр",
}
type Category = keyof typeof categorizedSteps | "all"

export function AdviceContent() {
    const [selectedCategory, setSelectedCategory] = useState<Category>("all")
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(false);

    const selectedAdviceList =
        selectedCategory === "all"
            ? Object.entries(categorizedSteps).flatMap(([category, advices]) =>
                advices.map((advice, idx) => ({ ...advice, category, id: `${category}-${idx}` }))
            )
            : categorizedSteps[selectedCategory].map((advice, idx) => ({
                ...advice,
                category: selectedCategory,
                id: `${selectedCategory}-${idx}`,
            }));

    // Fetch read tips on component mount
    useEffect(() => {
        fetchReadTips();
    }, []);

    const fetchReadTips = async () => {
        try {
            const {
                data: { session },
                error: sessionError,
            } = await supabase.auth.getSession();

            if (sessionError || !session) {
                console.error('Session error:', sessionError);
                return;
            }

            const userId = session.user.id;

            const { data: readTips, error } = await supabase
                .from('read_tips')
                .select('tip_id')
                .eq('user_id', userId);

            if (error) {
                console.error('Error fetching read tips:', error);
                return;
            }

            const checkedState: Record<string, boolean> = {};
            readTips?.forEach(tip => {
                checkedState[tip.tip_id] = true;
            });
            
            setCheckedItems(checkedState);
        } catch (error) {
            console.error('Error in fetchReadTips:', error);
        }
    };

    const toggleChecked = async (id: string) => {
        const isCurrentlyChecked = checkedItems[id];
        
        // Update UI immediately for better UX
        setCheckedItems((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));

        try {
            // Record activity for the day
            await recordDailyActivity();

            if (!isCurrentlyChecked) {
                // Mark as read
                await markTipAsRead(id);
                toast.success("Зөвлөмж уншсан гэж тэмдэглэгдлээ!");
            } else {
                // Unmark as read
                await unmarkTipAsRead(id);
                toast.success("Зөвлөмжийн тэмдэглэгээ арилгагдлаа");
            }
        } catch (error) {
            console.error('Error toggling tip:', error);
            // Revert UI change on error
            setCheckedItems((prev) => ({
                ...prev,
                [id]: isCurrentlyChecked,
            }));
            toast.error("Алдаа гарлаа. Дахин оролдоно уу.");
        }
    };

    const markTipAsRead = async (tipId: string) => {
        const {
            data: { session },
            error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
            throw new Error("User session not found");
        }

        const userId = session.user.id;
        const category = tipId.split('-')[0];

        const { error } = await supabase
            .from('read_tips')
            .insert({
                user_id: userId,
                tip_id: tipId,
                category: category,
            });

        if (error && error.code !== '23505') { // Ignore duplicate key errors
            console.error('Error marking tip as read:', error);
            throw error;
        }
    };

    const unmarkTipAsRead = async (tipId: string) => {
        const {
            data: { session },
            error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
            throw new Error("User session not found");
        }

        const userId = session.user.id;

        const { error } = await supabase
            .from('read_tips')
            .delete()
            .eq('user_id', userId)
            .eq('tip_id', tipId);

        if (error) {
            console.error('Error unmarking tip as read:', error);
            throw error;
        }
    };

    const recordDailyActivity = async () => {
        try {
            const {
                data: { session },
                error: sessionError,
            } = await supabase.auth.getSession();

            if (sessionError || !session) {
                console.error('Session error in recordDailyActivity:', sessionError);
                return;
            }

            const userId = session.user.id;
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

            // Insert today's activity (will be ignored if already exists due to unique constraint)
            const { error } = await supabase
                .from('user_activity')
                .insert({
                    user_id: userId,
                    activity_date: today,
                });

            // Ignore unique constraint violations (user already has activity for today)
            if (error && error.code !== '23505') {
                console.error('Error recording daily activity:', error);
            }
        } catch (error) {
            console.error('Error in recordDailyActivity:', error);
        }
    };

    return (
        <div className="space-y-10 space-x-10">
            <div className="w-full flex gap-3 overflow-scroll py-2">
                {(["all", ...Object.keys(categorizedSteps)] as Category[]).map((category) => (
                    <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        onClick={() => setSelectedCategory(category)}
                        className="whitespace-nowrap"
                    >
                        {categoryLabels[category] || category}
                    </Button>
                ))}
            </div>

            <div className="flex flex-col gap-5">
                {selectedAdviceList.map((step) => (
                    <div
                        key={step.id}
                        className="w-full py-5 px-6 space-y-3 border border-neutral-300 rounded-xl flex items-center justify-between gap-4 bg-white"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 flex items-center justify-center bg-orange-100 rounded-lg">
                                <Lightbulb size={18} color="#EA580C" />
                            </div>

                            <div>
                                <p className="text-wrap text-sm font-medium">
                                    {step.content}
                                </p>
                                <button className="py-1 px-[10px] bg-gray-100 rounded-full text-xs font-medium mt-2">
                                    {categoryLabels[step.category] || step.category}
                                </button>
                            </div>
                        </div>

                        <div className="inline-block relative">
                            <input
                                type="checkbox"
                                id={step.id}
                                checked={!!checkedItems[step.id]}
                                onChange={() => toggleChecked(step.id)}
                                className="peer absolute opacity-0 w-5 h-5 text-white"
                                disabled={loading}
                            />
                            <label
                                htmlFor={step.id}
                                className="flex items-center justify-center w-5 h-5 rounded border border-gray-300 cursor-pointer
               peer-checked:bg-green-500 peer-checked:border-green-500 relative transition-colors duration-200
               hover:border-green-400 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
                            >
                                <svg 
                                    width="12" 
                                    height="9" 
                                    viewBox="0 0 12 9" 
                                    fill="none" 
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`transition-opacity duration-200 ${checkedItems[step.id] ? 'opacity-100' : 'opacity-0'}`}
                                >
                                    <path 
                                        fillRule="evenodd" 
                                        clipRule="evenodd" 
                                        d="M11.8047 0.528758C12.0651 0.789108 12.0651 1.21122 11.8047 1.47157L4.4714 8.8049C4.21105 9.06525 3.78894 9.06525 3.5286 8.8049L0.195262 5.47157C-0.0650874 5.21122 -0.0650874 4.78911 0.195262 4.52876C0.455612 4.26841 0.877722 4.26841 1.13807 4.52876L4 7.39069L10.8619 0.528758C11.1223 0.268409 11.5444 0.268409 11.8047 0.528758Z" 
                                        fill="white" 
                                    />
                                </svg>
                            </label>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}