/* eslint-disable @typescript-eslint/no-unused-vars */
import { redirect } from "next/navigation";

import { ReservationList } from "../_components/FoodListDisplay";

import { auth } from "@/lib/auth";
import { publicEnv } from "@/lib/env/public";

async function TastePage() {
  const session = await auth();

  if (!session || !session?.user) {
    redirect(publicEnv.NEXT_PUBLIC_BASE_URL);
  }
  const userId = session.user.id;

  return (
    <div className="no-scrollbar my-32 h-96 w-full space-y-12 overflow-y-scroll">
      <ReservationList />
    </div>
  );
}
export default TastePage;
