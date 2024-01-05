// 自訂的、用帳號密碼的provider
import CredentialsProvider from "next-auth/providers/credentials";

// future work?
// import GoogleProvider from 'next-auth/providers/google';
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { authSchema } from "@/validators/auth";

export default CredentialsProvider({
  name: "credentials",
  credentials: {
    // 登入頁會出現的欄位
    username: { label: "Userame", type: "text" },
    password: { label: "Password", type: "password" },
  },
  async authorize(credentials) {
    /*
    正確步驟
    1. 先驗證credential的型別是否正確(用schema.parse)
    2. 從db抓使用者資料進行比對，如果比對成功才會回傳user資料
    */
    // 1.
    // 宣告儲存credential型別驗證結果的變數
    let validatedCredentials: {
      username: string;
      password: string;
    };
    // 進行型別驗證
    try {
      // 型態正確的話應該就會得到credentials
      validatedCredentials = authSchema.parse(credentials);
    } catch (error) {
      console.log(error);
      console.log("Wrong credentials. Try again.");
      return null;
    }
    // destructing assignment再次取得user屬性（已驗證過的）
    const { username, password } = validatedCredentials;

    const [existedUser] = await db
      .select({
        id: usersTable.displayId,
        username: usersTable.username,
        hashedPassword: usersTable.hashedPassword,
      })
      .from(usersTable)
      .where(eq(usersTable.username, validatedCredentials.username))
      .execute();

    // 2.
    // Sign up
    if (!existedUser) {
      if (!username) {
        console.log("Name is required.");
        return null;
      }
      if (!password) {
        console.log("Password is required.");
        return null;
      }

      // hash密碼
      const hashedPassword = await bcrypt.hash(password, 10); // change this line

      // 在db insert user
      const [createdUser] = await db
        .insert(usersTable)
        .values({
          username: username,
          hashedPassword: hashedPassword,
        })
        .returning();

      return {
        username: createdUser.username,
        id: createdUser.displayId,
      };
    }

    // 比對密碼
    const isValid = await bcrypt.compare(password, existedUser.hashedPassword);

    if (!isValid) {
      console.log("Wrong password. Try again.");
      return null;
    }
    return {
      name: existedUser.username,
      id: existedUser.id,
    };
  },
});
