/* eslint-disable @typescript-eslint/no-explicit-any */
import { eq, not } from "drizzle-orm";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { auth } from "@/lib/auth";

const getUsers = async () => {
  try {
    const session = await auth();
    if (!session || !session?.user?.id) {
      return null;
    }
    const userId = session.user.id; // 目前登入的user

    // 取得所有其他user
    const users = await db
      .select({
        username: usersTable.username,
        userId: usersTable.displayId,
        image: usersTable.image,
      })
      .from(usersTable)
      .where(not(eq(usersTable.displayId, userId)))
      .execute();

    return users;
  } catch (error: any) {
    return null;
  }
};

export default getUsers;
