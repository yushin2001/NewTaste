import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { publicEnv } from "@/lib/env/public";

import { FoodList } from "./_components/FoodListDisplay";

async function TastePage() {
  const session = await auth();

  // new
  if (!session || !session?.user) {
    redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  }

  const categories = {
    taiwanese: "臺式",
    chinese: "中式",
    western: "西式",
    japanese: "日式",
    korean: "韓式",
    breakfast: "早餐",
    drinks: "飲料",
    desserts: "甜點",
  };

  return (
    <div className="no-scrollbar my-32 h-screen w-full space-y-12 overflow-y-scroll pb-40">
      {Object.entries(categories).map(([eng, chi]) => (
        <FoodList eng={eng} chi={chi} key={eng} />
      ))}
    </div>
  );
}
export default TastePage;
