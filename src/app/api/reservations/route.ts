/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { eq } from "drizzle-orm";
import Pusher from "pusher";

import { db } from "@/db";
import { foodTable, reservationTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { privateEnv } from "@/lib/env/private";
import { publicEnv } from "@/lib/env/public";

// 預定新增&刪除
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reserve, foodId, reservecount, foodCount } = body;

    const session = await auth();
    if (!session || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    if (reserve) {
      const newReservationId = await db.transaction(async (tx) => {
        const [newReservation] = await tx
          .insert(reservationTable)
          .values({
            userId: userId,
            foodId: foodId,
            count: reservecount,
          })
          .returning();
        return newReservation.id;
      });

      // 更新食物數量
      await db
        .update(foodTable)
        .set({
          count: foodCount - reservecount,
        })
        .where(eq(foodTable.displayId, foodId));

      console.log("成功預訂");
    } else {
      // 刪除預定
      await db
        .delete(reservationTable)
        .where(eq(reservationTable.userId, userId));

      // 更新食物數量（把取消預定的加回來）
      await db
        .update(foodTable)
        .set({
          count: foodCount + reservecount,
        })
        .where(eq(foodTable.displayId, foodId));

      console.log("成功刪除預定");
    }

    // Trigger pusher event
    const pusher = new Pusher({
      appId: privateEnv.PUSHER_ID,
      key: publicEnv.NEXT_PUBLIC_PUSHER_KEY,
      secret: privateEnv.PUSHER_SECRET,
      cluster: publicEnv.NEXT_PUBLIC_PUSHER_CLUSTER,
      useTLS: true,
    });

    // Private channels are in the format: private-...
    await pusher.trigger(foodId, "foodcount:update", reservecount);
    revalidatePath(`/taste/${foodId}`);

    console.log("成功");
    return new NextResponse("預定route", { status: 200 });
  } catch (error: any) {
    console.log(error, "ERROR_MESSAGES in reservations/route");
    return new NextResponse("過不去", { status: 500 });
  }
}
