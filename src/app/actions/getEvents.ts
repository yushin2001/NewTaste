/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/db";
import { eventsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

// 取得所有event，顯示在/taste畫面
const getEvents = async () => {
  try {
    const session = await auth();
    if (!session || !session?.user?.id) {
      return null;
    }
    const events = await db
      .select({
        event_id: eventsTable.displayId,
        user_id: eventsTable.userId,
        latest_time: eventsTable.latest_time,
        categoryName: eventsTable.categoryName,
        location: eventsTable.location,
      })
      .from(eventsTable)
      .execute();

    return events;
  } catch (error: any) {
    return null;
  }
};

export default getEvents;