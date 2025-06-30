"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lightbulb } from 'lucide-react';

const categorizedSteps = {
    career: [
        {
            content: "Шинэ ажилтанд карьер хөгжлийн жишээ замыг хуваалцаарай💡",
        },
        {
            content: "Карьерийн өсөлт бол чиглэл биш, чадвартай шууд холбоотой. Чадвараа л хөгжүүл 💪",
        },
        {
            content: "Тодорхой чиглэлгүй байлаа гээд санаа зовох хэрэггүй. Үйлдэл хийсээр байвал зам гарч ирнэ 🛤️",
        },
        {
            content: "“Гүн төвлөрөл” бол үнэ цэн бүтээх гол түлхүүр. Хөндлөнгийн сааднаас ангид бай 🧘",
        },
        {
            content: "Амжилттай хүмүүс өөрийн үнэ цэнийг бүтээж, дараа нь эрх чөлөөг олдог 🧱",
        },
        {
            content: "“Карьерийн дуудлага” өөрөө ирэхийг бүү хүлээ. Харин өөрөө бүтээ 🛠️",
        },
    ],
    technical: [
        {
            content: "Технологи байнга өөрчлөгдөнө. Харин суралцах чадвар байнга хожигч байдаг. 🔁",
        },
        {
            content: "Бага багаар, тогтмол сайжруул. Том ахиц өдөр бүрийн жижиг алхмаас эхэлдэг. 📈",
        },
        {
            content: "Код бол зөвхөн бичих биш, уншихад ойлгомжтой байхаас хамаардаг. 🧩",
        },
        {
            content: "“DRY” зарчим: давтагдсан зүйлсийг олж, нэгтгэж, автоматжуул. 🔂",
        },
        {
            content: "Дизайн бол зөвхөн гоё харагдах биш, хэрэглэчдэд ойлгомжтой байхаас хамаардаг. 🧩",
        },
        {
            content: "Алдаа бол суралцах эх үүсвэр. Debug хийх нь хөгжүүлэлтийн нэг чухал хэсэг. 🧠",
        }
    ],
    communication: [
        {
            content: "Сайн харилцагч сонсохдоо илүү сайн байдаг. Сонсох бол идэвхтэй үйлдэл. 👂",
        },
        {
            content: "Хүнд хэцүү сорилтыг хаяж зугтаах биш мэдлэг, ур чадвар, зориг, итгэлээр даван туулах хэрэгтэй. 💬",
        },
        {
            content: "“Би ингэж ойлгож байна...” гэж эхлэвэл зөрчил багасдаг. ✨",
        },
        {
            content: "Бусдыг шүүмжлэх биш, тэдний хэрэгцээ, мэдрэмжийг ойлгох гэж оролд. 🤝",
        },
        {
            content: "Тодорхой, товч, тайван хэл. Сэтгэл хөдлөлөө бус, зорилгоо удирд. 🧊",
        },

    ],
    leadership: [
        {
            content: "Жинхэнэ удирдагч бол бусдыг хамгаалж, дэмждэг хүн. 🛡️",
        },
        {
            content: "Итгэлцэл үүсгэх хамгийн сайн арга бол өөрөө ил тод байх. 🔍",
        },
        {
            content: "Удирдана гэдэг бол бусдыг чиглүүлэх биш, урам зориг өгөх. 🌟",
        },
        {
            content: "Сул талаа нуух хэрэггүй — зоригтой илэрхийлэх нь хүч чадал. 💬",
        },
        {
            content: "Бусдад үйлчлэх хандлага бол хамгийн хүчтэй манлайлал. 🤲",
        }
    ],
    teamwork: [
        {
            content: "Итгэл бол багийн амжилтын суурь. Итгэлгүй бол бусад нь нурна. 🧱",
        },
        {
            content: "Зөрчил бол зайлшгүй. Хамгийн гол нь зөрчилдөө зөв хандах. 🔥",
        },
        {
            content: "Амжилттай багууд нээлттэй, уян харилцаатай байдаг. 🔄",
        },
        {
            content: "Хариуцлагыг нэг хүн биш, бүх гишүүн хамт үүрдэг. ⚖️",
        },
        {
            content: "“Би” биш “бид” гэж сэтгэх нь хамтын амжилтын түлхүүр. 🌐",
        },
    ],
    workupbalance: [
        {
            content: "Бүх зүйлийг амжуулах гэж бүү оролд. Хамгийн чухлыг л сонго. 🎯",
        },
        {
            content: "“Үгүй” гэж хэлж сурах нь сэтгэл амар амьдралын эхлэл. 🚫",
        },
        {
            content: "Хугацаа хязгаарласан ажил үр дүнтэй байдгийг мартуузай. ⏳",
        },
        {
            content: "Амралт бол залхуурал биш. Цэнэглэлт гэж ойлго. 🔋",
        },
        {
            content: "Амжилт гэдэг зөвхөн ажилд биш, амьдралын бүх талд оршино. 🌈",
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

export function BuddyAdvice() {
    const [selectedCategory, setSelectedCategory] = useState<Category>("all")
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
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

    const toggleChecked = (id: string) => {
        setCheckedItems((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <div className="space-y-10 space-x-10">
            <div className="w-full flex gap-3 overflow-scroll py-2">
                {(["all", ...Object.keys(categorizedSteps)] as Category[]).map((category) => (
                    <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        onClick={() => setSelectedCategory(category)}
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

                        {/* <div className="inline-block relative">
                            <input
                                type="checkbox"
                                id={step.id}
                                checked={!!checkedItems[step.id]}
                                onChange={() => toggleChecked(step.id)}
                                className="peer absolute opacity-0 w-5 h-5 text-white"
                            />
                            <label
                                htmlFor={step.id}
                                className="flex items-center justify-center w-5 h-5 rounded border border-gray-300 cursor-pointer
               peer-checked:bg-green-500 peer-checked:border-green-500 relative"
                            >
                                <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M11.8047 0.528758C12.0651 0.789108 12.0651 1.21122 11.8047 1.47157L4.4714 8.8049C4.21105 9.06525 3.78894 9.06525 3.5286 8.8049L0.195262 5.47157C-0.0650874 5.21122 -0.0650874 4.78911 0.195262 4.52876C0.455612 4.26841 0.877722 4.26841 1.13807 4.52876L4 7.39069L10.8619 0.528758C11.1223 0.268409 11.5444 0.268409 11.8047 0.528758Z" fill="white" />
                                </svg>

                            </label>
                        </div> */}





                    </div>
                ))}
            </div>
        </div>
    );
}