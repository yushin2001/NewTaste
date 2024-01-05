import { NextResponse, type NextRequest } from "next/server";

import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { eventsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

// 根據eventId取得特定event資料
export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      eventId: string;
    };
  },
) {
  // 從session取得是哪個user在操作
  const session = await auth();
  if (!session || !session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // const userId = session.user.id;

  // 取得event資料
  // 利用query同時取得event creator的資料
  // Get the document
  const dbEvent = await db.query.eventsTable.findFirst({
    where: and(eq(eventsTable.displayId, params.eventId)),
    with: {
      creator: {
        columns: {
          displayId: true,
          username: true,
          image: true,
        },
      },
    },
  });

  if (!dbEvent) {
    return NextResponse.json({ error: "Doc Not Found" }, { status: 404 });
  }

  try {
    return NextResponse.json(
      {
        id: dbEvent.displayId,
        userId: dbEvent.userId,
        latestTime: dbEvent.latest_time,
        categoryName: dbEvent.categoryName,
        location: dbEvent.location,
        creator: dbEvent.creator,
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
