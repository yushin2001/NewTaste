/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth } from "@/lib/auth";

const getUsers = async () => {
  try {
    const session = await auth();
    if (!session || !session?.user?.id) {
      return null;
    }
    const username = session.user.username; // 目前登入的user

    return username;
  } catch (error: any) {
    return null;
  }
};

export default getUsers;
