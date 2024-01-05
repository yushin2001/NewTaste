import { eq } from "drizzle-orm";

import { db } from "@/db";
import { usersTable } from "@/db/schema";

const getUsername = async (userId: { userId: string }) => {
  const [user] = await db
    .select({
      username: usersTable.username,
    })
    .from(usersTable)
    .where(eq(usersTable.displayId, userId.userId))
    .execute();

  if (!user) return null;
  return user;
};

export default getUsername;
