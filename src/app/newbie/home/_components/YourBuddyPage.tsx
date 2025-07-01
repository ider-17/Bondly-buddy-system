import BuddyInterests from "@/app/_components/BuddyInterest";
import BuddyProfile from "@/app/_components/BuddyProfile";
import MyInterests from "@/app/_components/MyInterests";

export default function YourPrimaryBuddy() {
  return (
    <div>
      <header className="h-fit header p-5 px-20 flex bg-white items-center border-b border-gray-200">
        <div>
          <h6 className="text-base font-medium">Таны үндсэн хамтрагч</h6>
          <p className="text-xs font-medium text-neutral-500">
            Таны onboarding үйл явцын туршид тогтмол дэмжин тусалж хамт байх таны зөвлөх ментор
          </p>
        </div>
      </header>

      <div className="bg-slate-100 py-10 px-20 min-h-screen space-y-5">
        <BuddyProfile />
        <BuddyInterests />

        <div className="py-5 px-6 rounded-xl bg-white border border-gray-200 space-y-5">
          <h5 className="text-lg font-semibold">Танилцуулга</h5>
          <p className="text-sm">
            Сайн уу👋. Намайг Тайванбат гэдэг. Би энэ компанид 4 дэх жилдээ ажиллаж байна. 
            Чиний Primary Buddy-гийн хувьд onboarding-ийн бүх хугацаанд тогтмол дэмжлэг үзүүлэх хүн чинь байх болно. 
            4 жилийн хугацаанд олон төрлийн төсөл дээр ажиллаж, шинэ гишүүдийг амжилттай адапт хийхэд нь тусалж байсан туршлагатай. 
            Би UX/UI дизайны чиглэлээр мэргэшсэн бөгөөд олон салбарын хамтарсан төслүүдийг удирдан ажиллаж байсан туршлагатай. 
            Хамгийн анхны өдрөөс эхлээд бүх үе шатанд чамайг дэмжинэ🤗. Асуух, санал солилцох зүйл байвал хэзээд нээлттэй шүү🙌
          </p>

          <hr />

          <div className="flex gap-6 justify-center text-center">
            <div>
              <p className="text-lg font-bold text-blue-700">4</p>
              <p className="text-sm font-medium">Ажлын туршлага (жилээр)</p>
            </div>
            <div>
              <p className="text-lg font-bold text-green-700">12</p>
              <p className="text-sm font-medium">Тусалсан шинэ ажилтнууд</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}