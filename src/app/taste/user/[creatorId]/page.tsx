import { redirect } from "next/navigation";

import { UserFoodList } from "../../_components/FoodListDisplay";

import { auth } from "@/lib/auth";
import { publicEnv } from "@/lib/env/public";

async function CreatorFoodPage({ params }: { params: { creatorId: string } }) {
  const session = await auth();

  // new
  if (!session || !session?.user) {
    redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  }

  return (
    <div className="no-scrollbar my-32 h-screen w-full space-y-12 overflow-y-scroll pb-40">
      <UserFoodList userId={params.creatorId} />
    </div>
  );
}
export default CreatorFoodPage;
