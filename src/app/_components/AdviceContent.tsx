"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lightbulb } from 'lucide-react';

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
            content: "“Үгүй” гэж хэлж сур. Ачааллаа хэт нэмэх нь бүтээмж бууруулах эрсдэлтэй🫶",
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
            <div className="flex gap-3 flex-wrap">
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

            <div className="flex flex-col gap-6">
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
                                <p className="text-wrap">
                                    {step.content}
                                </p>
                                <button className="py-1 px-[10px] bg-gray-100 rounded-full text-sm mt-2">
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
                        </div>





                    </div>
                ))}
            </div>
        </div>
    );
}