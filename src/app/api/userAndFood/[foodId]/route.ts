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

    const haveorNot = await db
      .select()
      .from(reservationTable)
      .where(
        and(
          eq(reservationTable.userId, userId),
          eq(reservationTable.foodId, params.foodId),
        ),
      )
      .execute();

    console.log(haveorNot.length === 0);

    return NextResponse.json(haveorNot.length === 0, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
