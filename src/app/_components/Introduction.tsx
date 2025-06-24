import { Hand } from "lucide-react";

export default function Introduction() {
    return (
        <div className="w-full border border-neutral-300 py-5 px-6 bg-slate-50 rounded-xl">
            <div className="flex gap-3 items-center mb-5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Hand size={18} color="#3B82F6" />
                </div>

                <h6 className="text-lg font-semibold">Introduction</h6>
            </div>

            <p className="mb-3">Сайн уу👋. Намайг Тайванбат гэдэг. Би энэ компанид 4 дэх жилдээ ажиллаж байна. Чиний Primary Buddy-гийн хувьд onboarding-ийн бүх хугацаанд тогтмол дэмжлэг үзүүлэх хүн чинь байх болно✨.4 жилийн хугацаанд олон төрлийн төсөл дээр ажиллаж, шинэ гишүүдийг амжилттай адапт хийхэд нь тусалж байсан туршлагатай. Би UX/UI дизайны чиглэлээр мэргэшсэн бөгөөд олон салбарын хамтарсан төслүүдийг удирдан ажиллаж байсан туршлагатай. Хамгийн анхны өдрөөс эхлээд бүх үе шатанд чамайг дэмжинэ🤗. Асуух, санал солилцох зүйл байвал хэзээд нээлттэй шүү🙌</p>

            <hr />

            <div className="w-full flex gap-6 justify-center text-center mt-3">
                <div>
                    <p className="text-blue-700 text-xl font-bold mb-2">4</p>
                    <p className="text-xs font-medium">Years Experince</p>
                </div>

                <div>
                    <p className="text-green-700 text-xl font-bold mb-2">8</p>
                    <p className="text-xs font-medium">Mentees Helped</p>
                </div>
            </div>

        </div>
    )
}