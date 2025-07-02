import { useState } from "react";
import { Mountain, FilePlus2 } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Challenge {
  id: string;
  title: string;
  week: string;
  difficulty: "Easy" | "Medium" | "Hard";
  note: string | null;
  status: string | null;
  user_id: string;
  created_at: string;
  derivedStatus?: string;
}

interface Submission {
  id: string;
  challenge_id: string;
  user_id: string;
  note: string;
  status: string;
  submitted_at: string;
}

interface ChallengesProps {
  challenges: Challenge[];
  submissions: Submission[];
  loading: boolean;
  onSubmit: (challengeId: string, note: string) => Promise<void>;
}

// Individual challenge component to handle its own dialog state
function ChallengeItem({
  challenge,
  onSubmit,
  showDivider,
}: {
  challenge: Challenge;
  onSubmit: (challengeId: string, note: string) => Promise<void>;
  showDivider: boolean;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [note, setNote] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note?.trim()) return;

    try {
      await onSubmit(challenge.id, note.trim());
      setNote("");
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to submit challenge:", error);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    setNote(open ? challenge.note ?? "" : "");
  };

  return (
    <div className="rounded-lg bg-white">
      <div className="flex justify-between items-start">
        <div className="flex-1 space-y-5">
          <h3 className="font-medium text-base mb-5">{challenge.title}</h3>

          <div className="flex gap-2">
            {challenge.derivedStatus === "pending" && (
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                Хүлээгдэж байгаа
              </span>
            )}
            {challenge.derivedStatus === "completed" && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                Биелэгдсэн
              </span>
            )}
            {challenge.derivedStatus === "active" && (
              <span className="px-[10px] py-1 border border-gray-200 rounded-full text-xs font-medium">
                {challenge.week || "1-р долоо хоног"}
              </span>
            )}
            <span
              className={`h-fit px-3 py-1 rounded-full text-xs font-medium ${challenge.difficulty === "Easy"
                ? "bg-green-100 text-green-800"
                : challenge.difficulty === "Medium"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-pink-100 text-pink-800"
                }`}
            >
              {challenge.difficulty === "Easy"
                ? "Хялбар"
                : challenge.difficulty === "Medium"
                  ? "Дундаж"
                  : "Хэцүү"}
            </span>
          </div>

          {challenge.derivedStatus === "active" && (
            <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
              <DialogTrigger asChild>
                <button className="flex gap-2 border border-neutral-300 py-2 px-3 rounded-lg items-center w-fit cursor-pointer select-none hover:bg-gray-200 active:bg-black active:text-white bg-transparent">
                  Тэмдэглэл бичих
                  <FilePlus2 size={20} />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[445px] bg-white">
                <DialogHeader>
                  <DialogTitle className="text-xl px-5 py-8">
                    Тэмдэглэл бичих
                  </DialogTitle>
                  <hr />
                  <DialogDescription className="px-5 pt-5 text-[16px] text-black">
                    Сорилтын тэмдэглэл
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <textarea
                    name="note"
                    placeholder="Ахиц дэвшлээ, тулгарсан сорилтууд болон сурсан зүйлсээ бичнэ үү..."
                    className="w-100 bg-white border border-gray-200 py-2 px-3 mx-5 rounded-md mb-4 min-h-[100px]"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    required
                  />
                  <hr />
                  <div className="flex gap-[10px] justify-between p-5 py-9">
                    <DialogClose asChild>
                      <button
                        type="button"
                        className="w-1/2 py-1 px-4 flex justify-center items-center border border-neutral-300 rounded-md cursor-pointer text-black hover:bg-gray-200 active:bg-black active:text-white"
                      >
                        Cancel
                      </button>
                    </DialogClose>
                    <button
                      type="submit"
                      className="w-1/2 border py-2 px-4 bg-black text-white flex justify-center items-center rounded-md cursor-pointer hover:bg-gray-800 active:bg-gray-300 active:text-black"
                    >
                      Submit for Approval
                    </button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}

          {showDivider && <hr className="mb-5" />}
        </div>
      </div>
    </div>
  );
}

export default function Challenges({
  challenges,
  submissions,
  loading,
  onSubmit,
}: ChallengesProps) {
  const [activeTab, setActiveTab] = useState("Active");
  const [selectedWeek, setSelectedWeek] = useState("all");

  const getChallengeStatus = (challengeId: string) => {
    const submission = submissions.find(
      (sub) => sub.challenge_id === challengeId
    );
    if (!submission) {
      return "active";
    }
    return submission.status === "approved" ? "completed" : "pending";
  };

  const getFilteredChallenges = () => {
    const challengesWithStatus = challenges.map((challenge) => ({
      ...challenge,
      derivedStatus: getChallengeStatus(challenge.id),
    }));

    let filteredByStatus;
    switch (activeTab.toLowerCase()) {
      case "active":
        filteredByStatus = challengesWithStatus.filter(
          (ch) => ch.derivedStatus === "active"
        );
        break;
      case "pending":
        filteredByStatus = challengesWithStatus.filter(
          (ch) => ch.derivedStatus === "pending"
        );
        break;
      case "completed":
        filteredByStatus = challengesWithStatus.filter(
          (ch) => ch.derivedStatus === "completed"
        );
        break;
      default:
        filteredByStatus = challengesWithStatus;
    }

    if (selectedWeek === "all") {
      return filteredByStatus;
    } else {
      return filteredByStatus.filter((ch) => ch.week === selectedWeek);
    }
  };

  const getStatusCounts = () => {
    const challengesWithStatus = challenges.map((challenge) => ({
      ...challenge,
      derivedStatus: getChallengeStatus(challenge.id),
    }));

    const weekFilteredChallenges =
      selectedWeek === "all"
        ? challengesWithStatus
        : challengesWithStatus.filter((ch) => ch.week === selectedWeek);

    return {
      active: weekFilteredChallenges.filter(
        (ch) => ch.derivedStatus === "active"
      ).length,
      pending: weekFilteredChallenges.filter(
        (ch) => ch.derivedStatus === "pending"
      ).length,
      completed: weekFilteredChallenges.filter(
        (ch) => ch.derivedStatus === "completed"
      ).length,
    };
  };

  const filteredChallenges = getFilteredChallenges();
  const statusCounts = getStatusCounts();

  return (
    <div>
      <header className="h-fit header p-5 px-20 flex justify-between bg-white items-center border-b border-gray-200">
        <div>
          <h1 className="text-base font-medium">Сорилтууд</h1>
          <p className="text-xs font-medium text-neutral-500">
            Идэвхтэй, хүлээгдэж байгаа болон биелэгдсэн сорилтуудаа хянах
            боломжтой
          </p>
        </div>
      </header>

      <div className="py-10 px-20 bg-slate-100 space-y-5 min-h-screen">
        <div className="w-full flex gap-5">
          {[
            {
              name: "Идэвхтэй",
              count: statusCounts.active,
              key: "Active",
            },
            {
              name: "Хүлээгдэж байгаа",
              count: statusCounts.pending,
              key: "Pending",
            },
            {
              name: "Биелэгдсэн",
              count: statusCounts.completed,
              key: "Completed",
            },
          ].map((status, idx) => (
            <div
              key={idx}
              onClick={() => setActiveTab(status.key)}
              className={`w-1/3 bg-white border rounded-xl p-5 flex flex-col gap-2 cursor-pointer hover:bg-slate-100 transition-colors ${activeTab === status.key ? "border-gray-400" : "border-gray-200"
                }`}
            >
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex justify-center items-center">
                <Mountain size={18} color="#D97706" />
              </div>

              <div className="flex flex-col">
                <p className="text-lg font-bold">{status.count}</p>
                <p className="text-sm font-normal">{status.name}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-self-end justify-between items-center">
          <Select value={selectedWeek} onValueChange={setSelectedWeek}>
            <SelectTrigger className="py-5 rounded-lg text-sm bg-white border border-gray-200 select-none">
              <SelectValue placeholder="All weeks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Бүх долоо хоног</SelectItem>
              <SelectItem value="1-р долоо хоног">1-р долоо хоног</SelectItem>
              <SelectItem value="2-р долоо хоног">2-р долоо хоног</SelectItem>
              <SelectItem value="3-р долоо хоног">3-р долоо хоног</SelectItem>
              <SelectItem value="4-р долоо хоног">4-р долоо хоног</SelectItem>
              <SelectItem value="5-р долоо хоног">5-р долоо хоног</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="p-5 border border-gray-200 rounded-xl bg-white">
          {loading ? (
            <div className="text-center py-8">
              <p>Сорилтуудыг ачааллаж байна...</p>
            </div>
          ) : filteredChallenges.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {activeTab === "Active"
                  ? "Идэвхтэй"
                  : activeTab === "Pending"
                    ? "Хүлээгдэж байгаа"
                    : "Биелэгдсэн"}{" "}
                сорилт олдсонгүй.
              </p>
            </div>
          ) : (
            <div>
              {filteredChallenges.map((challenge, index) => (
                <ChallengeItem
                  key={challenge.id}
                  challenge={challenge}
                  onSubmit={onSubmit}
                  showDivider={index !== filteredChallenges.length - 1} // 🟡 Сүүлийнх дээр divider байхгүй
                />
              ))}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}