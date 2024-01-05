/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/db";
import { eventsTable, foodTable, reservationTable } from "@/db/schema";

// 新增event
export const CreateEvent = async (
  userID: string,
  category_name: string,
  location: string,
  latest_time: string,
) => {
  try {
    const [newEvent] = await db
      .insert(eventsTable)
      .values({
        userId: userID,
        categoryName: category_name,
        latest_time: latest_time,
        location: location,
      })
      .returning();
    return newEvent.displayId;
  } catch (error: any) {
    return null;
  }
};

// 新增event後，馬上接著新增食物
export const createFood = async (
  eventID: string,
  name: string,
  count: number,
  image: string,
) => {
  try {
    const [newFood] = await db
      .insert(foodTable)
      .values({
        eventId: eventID,
        name: name,
        count: count,
        image: image,
      })
      .returning();
    return newFood.displayId;
  } catch (error: any) {
    return null;
  }
};

// 新增event後，馬上接著新增食物
export const createReservation = async (
  userID: string,
  foodID: string,
  count: number,
  createdAt: Date,
) => {
  try {
    const [newReservation] = await db
      .insert(reservationTable)
      .values({
        userId: userID,
        foodId: foodID,
        count: count,
        createdAt: createdAt,
      })
      .returning();
    return newReservation.id;
  } catch (error: any) {
    return null;
  }
};
