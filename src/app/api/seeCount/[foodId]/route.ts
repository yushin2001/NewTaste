/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse, NextRequest } from "next/server";

import { eq, and } from "drizzle-orm";

import { db } from "@/db";
import { foodTable, reservationTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      foodId: string;
    };
  },
) {
  try {
    // Get user from session
    const session = await auth();
    if (!session || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const reserve_food = await db
      .select({
        userId: reservationTable.userId,
        foodId: reservationTable.foodId,
        count: reservationTable.count, //預定數量
        createdAt: reservationTable.createdAt, //預定時間
      })
      .from(reservationTable)
      .where(
        and(
          eq(reservationTable.userId, userId),
          eq(reservationTable.foodId, params.foodId),
        ),
      )
      .execute();

    console.log("預定數量" + reserve_food[0].count);

    return NextResponse.json(reserve_food[0].count, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
