"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";

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

    const selectedAdviceList = selectedCategory === "all"
        ? Object.entries(categorizedSteps).flatMap(([category, advices]) =>
            advices.map((advice) => ({ ...advice, category }))
        )
        : categorizedSteps[selectedCategory].map((advice) => ({
            ...advice,
            category: selectedCategory,
        }))



    return (
        <div className="space-y-6">
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
                {selectedAdviceList.map((step, index) => (
                    <div
                        key={index}
                        className="w-full py-5 px-6 space-y-3 border border-neutral-300 rounded-xl bg-slate-50"
                    >
                        <div className="flex gap-3">
                            <button className="py-1 px-[10px] bg-gray-100 rounded-full text-sm">
                                {/* {categoryLabels[step.category] || step.category} */}
                            </button>
                            <button className="py-1 px-[10px] bg-gray-100 rounded-full text-sm">
                                5 мин
                            </button>
                        </div>

                        <span className="inline-flex items-start gap-2 text-base leading-relaxed">
                            <img src="/lightbulb.png" alt="lightbulb" className="w-5 h-5 mt-1" />
                            {step.content}
                        </span>
                    </div>
                ))}
            </div>
        </div>

    )
}