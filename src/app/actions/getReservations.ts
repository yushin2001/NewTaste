/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { eventsTable, foodTable, reservationTable } from "@/db/schema";
import { auth } from "@/lib/auth";

const getReservations = async () => {
  try {
    const session = await auth();
    if (!session || !session?.user?.id) {
      return null;
    }

    const userId = session.user.id;

    const reserve_food = await db
      .select({
        userId: reservationTable.userId,
        foodId: reservationTable.foodId,
        count: reservationTable.count, //預定數量
        createdAt: reservationTable.createdAt, //預定時間
        name: foodTable.name,
        image: foodTable.image,
        time: eventsTable.latest_time,
        location: eventsTable.location,
      })
      .from(reservationTable)
      .leftJoin(foodTable, eq(foodTable.displayId, reservationTable.foodId))
      .leftJoin(eventsTable, eq(eventsTable.displayId, foodTable.eventId))
      .where(eq(reservationTable.userId, userId))
      .execute();

    return reserve_food;
  } catch (error: any) {
    return null;
  }
};

export default getReservations;
