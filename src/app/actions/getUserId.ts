/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";

const getUserId = async () => {
  try {
    const session = await auth();
    if (!session || !session?.user?.id) {
      return null;
    }
    const userID = session.user.id;
    return userID;
  } catch (error: any) {
    return null;
  }
};

export default getUserId;
