/* eslint-disable @typescript-eslint/no-explicit-any */
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { eventsTable, foodTable } from "@/db/schema";
import { auth } from "@/lib/auth";

// 取得所有event，顯示在/taste畫面
const getEventContent = async (eventID: string) => {
  try {

    const session = await auth();
    if (!session || !session?.user?.id) {
      return null;
    }

    const eventSubquery = db.$with("event_subquery").as(
      db
        .select({
          userId: eventsTable.userId,
          eventId: eventsTable.displayId,
          latest_time: eventsTable.latest_time,
          categoryName: eventsTable.categoryName,
          location: eventsTable.location,
        })
        .from(eventsTable)
        .where(eq(eventsTable.displayId, eventID)),
    );

    const events = await db
      .with(eventSubquery)
      .select({
        userId: eventSubquery.userId,
        event_id: eventsTable.displayId,
        user_id: eventsTable.userId,
        latest_time: eventsTable.latest_time,
        categoryName: eventsTable.categoryName,
        location: eventsTable.location,
        name: foodTable.name,
        count: foodTable.count,
        image: foodTable.image,
      })
      .from(foodTable)
      .leftJoin(eventSubquery, eq(foodTable.eventId, eventSubquery.eventId))
      .execute();

    return events;
  } catch (error: any) {
    return null;
  }
};

export default getEventContent;
