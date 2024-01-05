import { NextResponse, type NextRequest } from "next/server";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { foodTable } from "@/db/schema";
import { auth } from "@/lib/auth";

// 根據eventId取得特定event資料
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
  // 從session取得是哪個user在操作
  const session = await auth();
  if (!session || !session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 取得event資料
  // 利用query同時取得event creator的資料
  const dbFood = await db.query.foodTable.findFirst({
    where: and(eq(foodTable.displayId, params.foodId)),
    with: {
      event: {
        columns: {
          displayId: true,
          userId: true,
          categoryName: true,
          location: true,
          latest_time: true,
        },
      },
    },
  });

  if (!dbFood) {
    return NextResponse.json({ error: "Food Not Found" }, { status: 404 });
  }

  try {
    return NextResponse.json(
      {
        id: dbFood.displayId,
        name: dbFood.name,
        count: dbFood.count,
        image: dbFood.image,
        event: dbFood.event,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
