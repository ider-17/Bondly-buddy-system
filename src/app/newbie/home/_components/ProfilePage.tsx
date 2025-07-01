import ProfileCard from "@/app/_components/ProfileCard";
import MoreInformation from "@/app/_components/MoreInformation";
import MyInterests from "@/app/_components/MyInterests";
import YourProgress from "@/app/_components/YourProgress";
import CareerGoals from "@/app/_components/CareerGoals";
import YourProgressProfile from "@/app/_components/YourProgressProfile";

export default function Profile() {
  return (
    <div>
      <header className="h-fit header p-5 px-20 flex bg-white items-center border-b border-gray-200">
        <div>
          <h6 className="text-base font-medium">Профайл</h6>
          <p className="text-xs font-medium text-neutral-500">
            Өөрийн хувийн мэдээллээ харах, хянах боломжтой
          </p>
        </div>
      </header>

      <div className="bg-slate-100 py-10 px-20 min-h-screen flex gap-5">
        <div className="w-1/2 space-y-5">
          <ProfileCard />
          <MoreInformation />
          <MyInterests />
        </div>

        <div className="w-1/2 space-y-5">
          <div className='rounded-lg border border-gray-200 py-5 px-6 space-y-5 bg-white'>
            <div>
              <h6 className='text-lg font-medium mb-5'>Таны прогресс</h6>
              <hr />
              <YourProgressProfile />
            </div>
          </div>

          <CareerGoals />
        </div>
      </div>
    </div>
  );
}